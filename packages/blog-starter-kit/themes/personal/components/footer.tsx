import { useAppContext } from './contexts/appContext';

export const Footer = () => {
	const { publication } = useAppContext();

	return (
		<footer className="border-t pt-10 text-sm text-neutral-500 dark:border-neutral-800 dark:text-neutral-400">
			{publication.descriptionSEO && (
				<p className="mb-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
					{publication.descriptionSEO}
				</p>
			)}
			&copy; {new Date().getFullYear()} {publication.title}
		</footer>
	);
};
