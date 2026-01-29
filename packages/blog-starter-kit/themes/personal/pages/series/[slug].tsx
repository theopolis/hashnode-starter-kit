import request from 'graphql-request';
import { GetStaticPaths, GetStaticProps } from 'next';
import Head from 'next/head';
import { Container } from '../../components/container';
import { AppProvider } from '../../components/contexts/appContext';
import { Footer } from '../../components/footer';
import { Layout } from '../../components/layout';
import { MinimalPosts } from '../../components/minimal-posts';
import { PersonalHeader } from '../../components/personal-theme-header';
import {
	PostFragment,
	PostsBySeriesDocument,
	PostsBySeriesQuery,
	PostsBySeriesQueryVariables,
	PublicationFragment,
	SeriesListDocument,
	SeriesListQuery,
	SeriesListQueryVariables,
} from '../../generated/graphql';

const GQL_ENDPOINT = process.env.NEXT_PUBLIC_HASHNODE_GQL_ENDPOINT;

type SeriesInfo = {
	slug: string;
	name: string;
};

type Props = {
	publication: PublicationFragment;
	series: {
		id: string;
		name: string;
		slug: string;
		description: string | null;
	};
	posts: PostFragment[];
	seriesList: SeriesInfo[];
};

export default function SeriesPage({ publication, series, posts, seriesList }: Props) {
	return (
		<AppProvider publication={publication}>
			<Layout>
				<Head>
					<title>
						{series.name} - {publication.title}
					</title>
					<meta name="description" content={series.description || `Posts in ${series.name} series`} />
				</Head>
				<Container className="mx-auto flex max-w-3xl flex-col items-stretch gap-10 px-5 py-10">
					<PersonalHeader seriesList={seriesList} activeSeries={series.slug} />
					<div className="flex flex-col gap-4">
						<h1 className="text-3xl font-bold text-black dark:text-white">{series.name}</h1>
						{series.description && (
							<p className="text-slate-600 dark:text-slate-300">{series.description}</p>
						)}
					</div>
					{posts.length > 0 && <MinimalPosts context="series" posts={posts} />}
					<Footer />
				</Container>
			</Layout>
		</AppProvider>
	);
}

type Params = {
	slug: string;
};

export const getStaticProps: GetStaticProps<Props, Params> = async ({ params }) => {
	if (!params) {
		throw new Error('No params');
	}

	const data = await request<PostsBySeriesQuery, PostsBySeriesQueryVariables>(
		GQL_ENDPOINT,
		PostsBySeriesDocument,
		{
			host: process.env.NEXT_PUBLIC_HASHNODE_PUBLICATION_HOST,
			seriesSlug: params.slug,
			first: 20,
		},
	);

	const seriesListData = await request<SeriesListQuery, SeriesListQueryVariables>(
		GQL_ENDPOINT,
		SeriesListDocument,
		{
			first: 10,
			host: process.env.NEXT_PUBLIC_HASHNODE_PUBLICATION_HOST,
		},
	);

	const publication = data.publication;
	const series = publication?.series;

	if (!publication || !series) {
		return {
			notFound: true,
		};
	}

	const posts = series.posts.edges.map((edge) => edge.node);
	const seriesList = (seriesListData.publication?.seriesList.edges ?? []).map((edge) => ({
		slug: edge.node.slug,
		name: edge.node.name,
	}));

	return {
		props: {
			publication,
			series: {
				id: series.id,
				name: series.name,
				slug: series.slug,
				description: series.description?.text || null,
			},
			posts,
			seriesList,
		},
		revalidate: 1,
	};
};

export const getStaticPaths: GetStaticPaths = async () => {
	const data = await request<SeriesListQuery, SeriesListQueryVariables>(
		GQL_ENDPOINT,
		SeriesListDocument,
		{
			host: process.env.NEXT_PUBLIC_HASHNODE_PUBLICATION_HOST,
			first: 10,
		},
	);

	const seriesSlugs = (data.publication?.seriesList.edges ?? []).map((edge) => edge.node.slug);

	return {
		paths: seriesSlugs.map((slug) => ({
			params: { slug },
		})),
		fallback: 'blocking',
	};
};
