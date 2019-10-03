---
title: "Blogging in Org Mode"
excerpt: "My workflow for blogging in org mode, with jekyll and org-export."
date: 2019-09-24
categories: 
- post
tags: 
---
I recently transitioned from writing my posts directly in markdown to writing them in
[org mode](https://orgmode.org/), a document authoring system built in GNU Emacs. I learned a lot in the
process, and wanted to share some of the techniques and tools I cobbled together in a
post. 


## Org Mode and the Meaning of Life


### What is Org Mode?

Laozi said that the Tao that can be told is not the eternal Tao; I think we can safely
say the same of org mode.

Org mode is many things to many people, but at it's core it is a tool for taking notes
and organizing lists. Additional functionality allows for simple text markup, links,
inline images, rendered \\(\LaTeX\\) fragments, and so on. You can embed and run code blocks
within org files, using the powerful [`org-babel`](https://orgmode.org/worg/org-contrib/babel/) package. Some people have even [written
their Ph.D. thesis in org mode](https://write.as/dani/writing-a-phd-thesis-with-org-mode). It's an amazingly powerful tool, with a passionate user
base that is constantly expanding its capabilities.


### Why Not Markdown?

I like to use org mode for my personal and professional note-taking because it has very
good folding features - you can hide all headings besides the one you're focusing
on. You can even "narrow" your buffer, so that only the heading ("subtree", in org-mode
parlance) that you're working on is present at all.

Org mode also has some nice visual features for writing, such as:

-   rendering \\(\LaTeX\\) fragments inline
-   styling **bold**, <u>underlined</u>, and *italicized* text properly
-   excellent automatic formatting of tables
-   code syntax highlighting in various languages
-   display of images inline

I wrote in markdown (using `markdown-mode` within emacs) for some time, but once I saw
what org mode had to offer, I realized that I needed to transfer my blogging over to
org. Below is a short clip that shows just some of what org mode has to offer. You'll
want to full-screen it to make the text legible.

<iframe width="560" height="315" src="https://www.youtube.com/embed/MV9LR2LCxAE" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

Overall, I find the experience of writing in org much more enjoyable than writing in
markdown. Plus, I love hacking on emacs, and moving my blogging workflow over to org
presented me with an opportunity to do just that! So of course, I couldn't resist.


## Org-Export and Jekyll


### Blogging in Jekyll

The primary tool I use to generate my blog is a static-site generator called [Jekyll](https://jekyllrb.com/),
which is written in Ruby. I wrote [a previous post](/_posts/2017-12-29-website.md) describing my process for setting up
my site. [Pelican](https://blog.getpelican.com/) is a similar tool written in Python, and [Hugo](https://gohugo.io/) is a
static-site generator written in Go. We'll talk a bit more about Hugo later.

All of these tools allow the user to write in simple markdown, with the site generator
doing most of the heavy lifting in generating a full static site behind the
scenes. However, there are many dialects of markdown, and each has subtle differences,
so there is not, in general, one markdown specification to rule them all. 


### Org-Export

Org mode comes packaged with many built-in "exporters", which convert from the org
format to other text formats, including HTML, \\(\LaTeX\\), iCalendar, and more. It *does*
come with a backend that converts org to markdown, in which case we should be in
business - just run the pre-defined `org-md-export` and we're in business!

Unfortunately, this doesn't work well, for a few reasons. I find the native markdown
exporter to be a quite poor tool; it falls back on using pure HTML (for example, to
generate footnotes) when there are markdown-native ways of accomplishing the same
thing. Also, some things don't work at all - for example, equation exporting won't work,
since markdown requires you to enclose LaTeX with `\\[` and `\\]`, whereas HTML only
requires a single slash.[^fn1]

A quick search will show that there are many tools built to address this problem. Org
exporter backends are designed to be easy to extend, and many users have extended the
markdown backend to work with specific static site generators. The most fully developed
of these is [`ox-hugo`](https://ox-hugo.scripter.co/).[^fn2]

Discuss `ox-jekyll-md` and `ox-hugo`


### Building `ox-jekyll-lite`

1.  Customizing an Org Export Backend

2.  Implementation Details for `ox-jekyll-lite`

    -   making links relative to jekyll root
    -   footnotes and stuff
    -   equation rendering


## My Blogging Workflow

-   Have brilliant idea for a post
-   Make an org file
-   export to markdown via `C-c C-e j j`
-   commit & push
-   profit!

Don't forget to mention:

-   gotta exclude `ltximg` and `*.org` in jekyll config yaml


## Conclusion

If you're starting fresh & love org, use ox-hugo

Otherwise, this is a reaosnable solution. Would probably work fine with pelican as
well. (just modify the header stuff)

Explore more in org mode! Mention org-babel. 


<!-- Footnotes -->

[^fn1]: The double slash is required because markdown interprets the first slash as an escape character.
[^fn2]: `ox-hugo` is designed for a slightly different workflow than mine, in which the entire <u>site</u> is in a single org file.
