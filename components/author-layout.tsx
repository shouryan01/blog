import { Footer } from '@/components/footer'
import Image from 'next/image'
import { ReactNode } from 'react'

interface Authors {
  name: string
  avatar?: string
  occupation?: string
  company?: string
  email?: string
  github?: string
  linkedin?: string
  twitter?: string
  bluesky?: string
}

interface Props {
  children: ReactNode
  content: Omit<Authors, '_id' | '_raw' | 'body'>
  publication: any // You may want to import the proper type from generated/graphql
}

export default function AuthorLayout({ children, content, publication }: Props) {
  const { name, avatar, occupation, company, email, github, linkedin, twitter, bluesky } = content

  return (
    <>
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        {/* <div className="space-y-2 pt-6 pb-8 md:space-y-5">
          <h1 className="text-3xl leading-9 font-extrabold tracking-tight text-gray-900 sm:text-4xl sm:leading-10 md:text-6xl md:leading-14 dark:text-gray-100">
            About
          </h1>
        </div> */}
        <div className="items-center space-y-2">
          {/* xl:grid xl:grid-cols-3 xl:space-y-0 xl:gap-x-8 */}
          <div className="flex flex-col items-center space-x-2 pt-8 sm:pt-44">
            {avatar && (
              <Image
                src={avatar}
                alt="avatar"
                width={192}
                height={192}
                className="h-40 w-40 rounded-full sm:h-52 sm:w-52"
              />
            )}
            {/* <h3 className="pt-4 pb-2 text-2xl leading-8 font-bold tracking-tight">{name}</h3> */}
            <div className="pt-4 text-2xl leading-8 font-bold tracking-tight"></div>
            <div className="text-lg text-gray-800 dark:text-gray-200">{occupation}</div>
            <div className="text-gray-800 sm:pb-0 dark:text-gray-200">{company}</div>
            {/* <div className="flex space-x-3 pt-6">
              <SocialIcon kind="mail" href={`mailto:${email}`} />
              <SocialIcon kind="github" href={github} />
              <SocialIcon kind="linkedin" href={linkedin} />
              <SocialIcon kind="x" href={twitter} />
              <SocialIcon kind="bluesky" href={bluesky} />
            </div> */}
            <div className="prose dark:prose-invert max-w-xl pt-28 pb-5 text-center sm:pt-16 sm:pb-10">
              {children}
            </div>
          </div>
        </div>
      </div>
      <Footer publication={publication} />
    </>
  )
}
