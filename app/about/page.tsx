import { Container } from '../../components/container';
import { Layout } from '../../components/layout';
import { Header } from '../../components/header';
import { Footer } from '../../components/footer';
import { AppProvider } from '../../components/contexts/appContext';
import { PublicationFragment } from '../../generated/graphql';
import request from 'graphql-request';
import { PageByPublicationDocument } from '../../generated/graphql';
import { AboutClient } from './about-client';
import type { Metadata } from 'next';

export default async function About() {
  const data = await request(
    process.env.NEXT_PUBLIC_HASHNODE_GQL_ENDPOINT!,
    PageByPublicationDocument,
    {
      slug: 'about',
      host: process.env.NEXT_PUBLIC_HASHNODE_PUBLICATION_HOST,
    }
  );

  const publication = data.publication;
  const page = data.publication?.staticPage || null;

  if (!publication) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Publication not found</h1>
          <p className="text-zinc-500 dark:text-zinc-400">Please check your configuration.</p>
        </div>
      </div>
    );
  }

  return (
    <AppProvider publication={publication}>
      <Layout publication={publication}>
        <Container className="mx-auto flex max-w-5xl flex-col items-stretch gap-10 px-5 py-10">
          <Header />
          <main>
            {/* <h1 className="mb-8 text-3xl font-bold text-zinc-900 dark:text-white">
              {page?.title || 'About'}
            </h1> */}
            {/* <AboutClient page={page} /> */}

            <div className="space-y-8 rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-700 dark:bg-zinc-900">
						{/* Author Info */}
						{publication?.author && (
							<div className="space-y-4">
								<div className="flex items-center gap-4">
									{publication?.author?.profilePicture && (
										<img
											src={publication.author.profilePicture}
											alt={publication.author.name}
											className="h-16 w-16 rounded-full"
											width={64}
											height={64}
										/>
									)}
									<div>
										<p className="font-medium text-zinc-900 dark:text-white">
											{publication?.author?.name}
										</p>
										{publication?.author?.tagline && (
											<p className="text-sm text-zinc-500 dark:text-zinc-400">
												{publication.author.tagline}
											</p>
										)}
									</div>
								</div>
								{publication?.author?.bio?.html && (
									<div
										className="prose prose-sm prose-slate dark:prose-invert"
										dangerouslySetInnerHTML={{ __html: publication.author.bio.html }}
									/>
								)}
							</div>
						)}

						{/* About Publication */}
						<div className="space-y-4 border-t border-zinc-200 pt-6 dark:border-zinc-700">
							<h2 className="text-xl font-bold text-zinc-900 dark:text-white">
								About this publication
							</h2>
							{publication?.about?.html ? (
								<div
									className="prose prose-slate dark:prose-invert max-w-none"
									dangerouslySetInnerHTML={{ __html: publication.about.html }}
								/>
							) : (
								<p className="text-zinc-500 dark:text-zinc-400">
									{publication?.descriptionSEO || `Welcome to ${publication?.title}'s blog.`}
								</p>
							)}
						</div>


						{/* Social Links */}
						{publication?.links && (
							<div className="border-t border-zinc-200 pt-6 dark:border-zinc-700">
								<div className="flex flex-wrap gap-4">
									{publication?.links?.github && (
										<a
											href={publication.links.github}
											target="_blank"
											rel="noopener noreferrer"
											className="text-zinc-600 hover:text-blue-600 dark:text-zinc-400 dark:hover:text-blue-400"
											title="GitHub"
										>
											<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
												<path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
											</svg>
										</a>
									)}
									{publication?.links?.linkedin && (
										<a
											href={publication.links.linkedin}
											target="_blank"
											rel="noopener noreferrer"
											className="text-zinc-600 hover:text-blue-600 dark:text-zinc-400 dark:hover:text-blue-400"
											title="LinkedIn"
										>
											<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
												<path d="M20.5 2h-17A1.5 1.5 0 002 3.5v17A1.5 1.5 0 003.5 22h17a1.5 1.5 0 001.5-1.5v-17A1.5 1.5 0 0020.5 2zM8 19H5v-9h3zM6.5 8.25A1.75 1.75 0 118.3 6.5a1.78 1.78 0 01-1.8 1.75zM19 19h-3v-4.74c0-1.42-.6-1.93-1.38-1.93A1.74 1.74 0 0013 14.19a.66.66 0 000 .14V19h-3v-9h2.9v1.3a3.11 3.11 0 012.7-1.4c1.55 0 3.36.86 3.36 3.66z"/>
											</svg>
										</a>
									)}
									{/* {publication?.links?.website && (
										<a
											href={publication.links.website}
											target="_blank"
											rel="noopener noreferrer"
											className="text-zinc-600 hover:text-blue-600 dark:text-zinc-400 dark:hover:text-blue-400"
											title="Website"
										>
											<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
												<path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM6.262 6.072a8.25 8.25 0 1010.562-.766 4.5 4.5 0 01-1.318 1.357L14.25 7.5l.165.33a.809.809 0 01-1.086 1.085l-.604-.302a1.125 1.125 0 00-1.298.21l-.132.131c-.439.44-.439 1.152 0 1.591l.296.296c.256.257.622.374.98.314l1.17-.195c.323-.054.654.036.905.245l1.33 1.108c.32.267.46.694.358 1.1a8.7 8.7 0 01-2.288 4.04l-.723.724a1.125 1.125 0 01-1.298.21l-.153-.076a1.125 1.125 0 01-.622-1.006v-1.089c0-.298-.119-.585-.33-.796l-1.347-1.347a1.125 1.125 0 01-.21-1.298L9.75 12l-1.64-1.64a6 6 0 01-1.676-3.257l-.172-1.03z" clipRule="evenodd" />
											</svg>
										</a>
									)}
									{publication?.links?.hashnode && (
										<a
											href={publication.links.hashnode}
											target="_blank"
											rel="noopener noreferrer"
											className="text-zinc-600 hover:text-blue-600 dark:text-zinc-400 dark:hover:text-blue-400"
											title="Hashnode"
										>
											<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
												<path fillRule="evenodd" d="M12 1.5a5.25 5.25 0 00-5.25 5.25v3a3 3 0 00-3 3v6.75a3 3 0 003 3h10.5a3 3 0 003-3v-6.75a3 3 0 00-3-3v-3c0-2.9-2.35-5.25-5.25-5.25zm3.75 8.25v-3a3.75 3.75 0 10-7.5 0v3h7.5z" clipRule="evenodd" />
											</svg>
										</a>
									)} */}
								</div>
							</div>
						)}
					</div>
          </main>
          {/* <Footer publication={publication} /> */}
        </Container>
      </Layout>
    </AppProvider>
  );
}

export async function generateMetadata(): Promise<Metadata> {
  const data = await request(
    process.env.NEXT_PUBLIC_HASHNODE_GQL_ENDPOINT!,
    PageByPublicationDocument,
    {
      slug: 'about',
      host: process.env.NEXT_PUBLIC_HASHNODE_PUBLICATION_HOST,
    }
  );

  if (!data.publication) {
    return {
      title: 'About',
      description: 'About page',
    };
  }

  const staticPage = data.publication.staticPage;

  return {
    title: `About - ${data.publication.title}`,
    description: `About ${data.publication.title}`,
  };
}

export async function generateStaticParams() {
  return [{}];
}
