import Link from 'next/link';
import { PostFragment, User } from '../generated/graphql';
import { DateFormatter } from './date-formatter';

type Author = Pick<User, 'name'>;
type Tag = NonNullable<PostFragment['tags']>[number];

type Props = {
	title: string;
	date: string;
	description?: string | null;
	tags?: Tag[] | null;
	author: Author;
	slug: string;
};

export const MinimalPostPreview = ({ title, date, description, tags, slug }: Props) => {
	const postURL = `/${slug}`;

	return (
		<section className="flex flex-col items-start gap-1">
			<h2 className="text-lg leading-tight tracking-tight text-black dark:text-white">
				<Link href={postURL}>{title}</Link>
			</h2>
			<p className="flex flex-wrap items-center gap-2">
				<Link href={postURL} className="text-sm text-neutral-600 dark:text-neutral-400">
					<DateFormatter dateString={date} />
				</Link>
				{description && (
					<>
						<span className="text-sm text-neutral-600 dark:text-neutral-400"></span>
						<span className="text-sm text-neutral-600 dark:text-neutral-400">{description}</span>
					</>
				)}
			</p>
			{tags && tags.length > 0 && (
				<ul className="flex flex-wrap items-center gap-2 pt-1">
					{tags.map((tag) => (
						<li key={tag.id}>
							<Link
								href={`/tag/${tag.slug}`}
								className="rounded-full border border-slate-200 px-2 py-0.5 text-xs text-slate-600 hover:bg-slate-50 dark:border-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-800"
							>
								#{tag.slug}
							</Link>
						</li>
					))}
				</ul>
			)}
		</section>
	);
};
