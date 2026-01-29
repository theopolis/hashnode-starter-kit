import Link from 'next/link';
import { User } from '../generated/graphql';
import { DateFormatter } from './date-formatter';

type Author = Pick<User, 'name'>;

type Props = {
	title: string;
	date: string;
	description?: string | null;
	author: Author;
	slug: string;
};

export const MinimalPostPreview = ({ title, date, description, slug }: Props) => {
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
		</section>
	);
};
