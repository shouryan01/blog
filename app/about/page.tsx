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
import SocialIcon from '@/components/social-icons';
import { authorData } from '@/data/author';
import Link from 'next/link';

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

            <div className="space-y-8 text-center rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-700 dark:bg-zinc-900">
						{/* Author Info */}
						{publication?.author && (
							<div className="space-y-4">
								<div className="flex items-center gap-4 justify-center">
									{publication?.author?.profilePicture && (
										<img
											src={publication.author.profilePicture}
											alt={publication.author.name}
											className="h-16 w-16 rounded-full"
											width={64}
											height={64}
										/>
									)}
									{/* <div>
										<p className="font-medium text-zinc-900 dark:text-white">
											{publication?.author?.name}
										</p>
										{publication?.author?.tagline && (
											<p className="text-sm text-zinc-500 dark:text-zinc-400">
												{publication.author.tagline}
											</p>
										)}
									</div> */}
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
						<div className="space-y-4  border-zinc-200 dark:border-zinc-700">
							{/* <h2 className="text-xl font-bold text-zinc-900 dark:text-white">
								About this website
							</h2> */}
							{/* {publication?.about?.html ? (
								<div
									className="prose prose-slate dark:prose-invert max-w-none"
									dangerouslySetInnerHTML={{ __html: publication.about.html }}
								/>
							) : (
								<p className="text-zinc-500 dark:text-zinc-400">
									{publication?.descriptionSEO || `Welcome to ${publication?.title}'s blog.`}
								</p>
							)} */}
							<div className="text-center space-y-4 md:space-y-0">
								<h2 className="text-xl font-semibold text-zinc-900 dark:text-white">
									Welcome to my website!
								</h2>
								<p>Click on the buttons below to learn more about my hobbies and interests.</p>
							</div>
						</div>

						<div className="space-y-4 border-t border-zinc-200 pt-6 dark:border-zinc-700">
							<h2 className="text-xl font-bold text-zinc-900 dark:text-white text-center">
								Current Hobbies
							</h2>
							<div className="flex flex-wrap gap-4 justify-center">
								<Link href="https://photos.shouryannikam.com" target="_blank" rel="noopener noreferrer">
									<div className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 hover:dark:bg-zinc-700 transition-colors">
										<span className="text-lg">📸</span>
										<span className="text-zinc-900 dark:text-white font-medium">Photos</span>
									</div>
								</Link>

								<Link href="https://www.github.com/shouryan01" target="_blank" rel="noopener noreferrer">
									<div className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 hover:dark:bg-zinc-700 transition-colors">
										<span className="text-lg">💻</span>
										<span className="text-zinc-900 dark:text-white font-medium">Programming</span>
									</div>
								</Link>
								<div className="flex items-center gap-2 px-3 py-2 rounded-lg">
									<span>🎸</span>
									<span className="text-zinc-900 dark:text-white">Guitar</span>
								</div>
								<div className="flex items-center gap-2 px-3 py-2 rounded-lg">
									<span>🏐</span>
									<span className="text-zinc-900 dark:text-white">Volleyball</span>
								</div>
								<div className="flex items-center gap-2 px-3 py-2 rounded-lg">
									<span>🥊</span>
									<span className="text-zinc-900 dark:text-white">Boxing</span>
								</div>
								{/* <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-zinc-100 dark:bg-zinc-800">
									<span>📸</span>
									<span className="text-zinc-900 dark:text-white">Photography</span>
								</div> */}
								{/* <div className="flex items-center gap-2 px-3 py-2 rounded-lg">
									<span>📚</span>
									<span className="text-zinc-900 dark:text-white">Reading</span>
								</div> */}
								<div className="flex items-center gap-2 px-3 py-2 rounded-lg">
									<span>🤠</span>
									<span className="text-zinc-900 dark:text-white">Line Dancing</span>
								</div>
							</div>
						</div>

					  {/* Media */}
						<div className="space-y-4 border-t border-zinc-200 pt-6 dark:border-zinc-700">
							<h2 className="text-xl font-bold text-zinc-900 dark:text-white text-center">
								Media I Enjoy
							</h2>
							<div className="flex flex-wrap gap-3 justify-center">
								<Link href="https://app.thestorygraph.com/profile/shouryannikam" target="_blank" rel="noopener noreferrer">
									<div className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors">
										<span className="text-lg">📚</span>
										<span className="text-zinc-900 dark:text-white font-medium">Books</span>
									</div>
								</Link>
								<Link href="https://letterboxd.com/snnikam01/films/" target="_blank" rel="noopener noreferrer">
									<div className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors">
										<span className="text-lg">🎬</span>
										<span className="text-zinc-900 dark:text-white font-medium">Movies</span>
									</div>
								</Link>
								<Link href="https://www.serializd.com/user/snnikam01/shows" target="_blank" rel="noopener noreferrer">
									<div className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors">
										<span className="text-lg">📺</span>
										<span className="text-zinc-900 dark:text-white font-medium">TV Shows</span>
									</div>
								</Link>
								<Link href="https://backloggd.com/u/snnikam01/games/" target="_blank" rel="noopener noreferrer">
									<div className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors">
										<span className="text-lg">🎮</span>
										<span className="text-zinc-900 dark:text-white font-medium">Video Games</span>
									</div>
								</Link>
							</div>
						</div>

						{/* Social Links */}
						{publication?.links && (
							<div className="border-t border-zinc-200 pt-6 dark:border-zinc-700">
								<div className="flex flex-wrap gap-4 justify-center">
								  <SocialIcon kind="mail" href={`mailto:${authorData.email}`} size={5} />
									<SocialIcon kind="github" href={publication?.links?.github || undefined} size={5} />
									<SocialIcon kind="linkedin" href={publication?.links?.linkedin || undefined} size={5} />
									<div className="border-l border-zinc-200 dark:border-zinc-700 h-6 my-auto" />
									<SocialIcon kind="instagram" href={authorData.instagram} size={5} />
									<SocialIcon kind="x" href={publication?.links?.twitter || undefined} size={5} />
									<SocialIcon kind="youtube" href={authorData.youtube} size={5} />
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
