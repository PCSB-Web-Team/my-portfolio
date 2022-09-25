import MDXComponents from "@/components/MDX/Components";
import Image from "next/image";
import { Container } from "@components/elements/Container";
import { useMDXComponent } from "next-contentlayer/hooks";
import { allBlogs } from "contentlayer/generated";
import { parseISO, format } from "date-fns";
import { meta, social } from "@/config";
import { TocItem } from "@components/blog/Toc";

export default function Post({ post }) {
 const Component = useMDXComponent(post.body.code);
 return (
  <Container title={`${meta.title} - ${post.title} `} description={post.summary} image={`${meta.url}${post.image}`} date={new Date(post.publishedAt).toISOString()} type="article">
   <article className="mx-auto mb-16 flex min-h-screen w-full max-w-2xl flex-col items-start justify-center">
    <div className="prose grid flex-1 grid-cols-1 gap-x-8 dark:prose-dark md:grid-cols-[1fr,minmax(auto,640px),1fr] md:[&>*]:col-start-2">
     <div>
      <header className="w-full">
       <h1 className="mt-6 mb-2 flex items-center box-decoration-clone bg-clip-text text-center font-poppins text-[2.5rem] font-semibold motion-reduce:transition-none">
        {post.title}
        <span className="bg-gradient-to-r from-[#6310ff] to-[#1491ff] box-decoration-clone bg-clip-text text-fill-transparent dark:from-[#a2facf] dark:to-[#64acff]">.</span>
       </h1>
       <div className="mt-2 flex w-full flex-col items-start justify-between md:flex-row md:items-center">
        <div>
         <div className="flex items-center">
          <Image alt={meta.title} height={24} width={24} src="/assets/avatar.png" className="rounded-full" />
          <time className="ml-2 text-sm text-gray-700 dark:text-gray-300" dateTime={parseISO(post.publishedAt)}>
           {post.author} / {format(parseISO(post.publishedAt), "MMMM dd, yyyy")}
          </time>
         </div>
        </div>
        <p className="min-w-32 mt-2 text-sm text-gray-600 dark:text-gray-400 md:mt-0">
         {post.wordCount} words • {post.readingTime.text}
        </p>
       </div>
      </header>
      <Component components={{ ...MDXComponents }} />
     </div>
     <div className="sticky top-24 !col-start-3 mt-8 ml-3 hidden max-w-[14rem] flex-col space-y-2 self-start text-base xl:flex">
      <p className="mb-0 text-sm uppercase">On this page</p>
      {post.headings.map((props) => (
       <TocItem key={props.slug} {...props} />
      ))}
     </div>
    </div>
    <div className="flex w-full justify-end py-4 text-gray-700 dark:text-gray-300">
     <a href={`https://github.com/${social.github.username}/${social.github.repo}/edit/main/data/blog/${post.slug}.mdx`} target="_blank" rel="noopener noreferrer">
      Suggest a change
     </a>
    </div>
   </article>
  </Container>
 );
}

export async function getStaticPaths() {
 return {
  paths: allBlogs.map((p) => ({ params: { slug: p.slug } })),
  fallback: false,
 };
}

export async function getStaticProps({ params }) {
 const post = allBlogs.find((post) => post.slug === params.slug);

 return { props: { post } };
}
