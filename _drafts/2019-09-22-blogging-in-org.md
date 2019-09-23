---
title: "Blogging in Org"
excerpt: "My workflow for blogging in org mode."
date: 2019-09-22
categories: 
- post
tags: 
comments: true
---

{% if jekyll.environment == "development" %}
IN DEV ENV
{% endif %}


{% if jekyll.environment == "production" %}
IN PROD ENV
{% endif %}


Basic idea is to rework [ox-jekyll](file:///Users/peterwills/.emacs.d/lisp/ox-jekyll-md/ox-jekyll-md.el) to fit my purposes. It's derived from ox-md which is
derived from ox-html.

[ox-jekyll source code](https://github.com/gonsie/ox-jekyll-md)

[ox-md source code](https://github.com/emacsmirror/org/blob/master/lisp/ox-md.el)

[ox-html source code](https://github.com/emacsmirror/org/blob/master/lisp/ox-html.el)


# TODO <code>[5/7]</code>

Schedules get ignored, which is correct. Can schedule or deadline parts of the post if
you want to.

-   [X] Fix underlining things
-   [X] Fix links
-   [ ] Fix equation delimiter rendering
-   [X] Ignore `ltximg` directories
-   [X] Get preamble export working
    -   [X] Pass subtitle in as excerpt
    -   [X] Set category as "post", don't set layout
-   [X] Get footnotes exporting properly
-   [ ] Insert disqus block at bottom of the page (or better yet, get disqus working as it should via jekyll)

Might put off the footnotes one, since it's mostly asthetic. Equation rendering is the
top priority at the moment.


## Fixing Equations

Look through [the code for ox-html](https:github.com/emacsmirror/org/blob/master/lisp/ox-html.el) and search for "latex" to find the parts where they
render latex. It's pretty complicated, which makes sense. We just need to change the
delimiters it uses.


## Fixing links

I need to go digging through the section where it generates links. I want to set up a
thing that specifically handles http links in there.

UPDATE: Actually, you can just write your links as `https://` instead of `https:`, and then
it works fine. I will start doing this in general, I think.


# Blogging in Org!

use `ox-jekyll`, which can be found [here](https://github.com/gonsie/ox-jekyll-md).

but I need to redefine the way it exports equations

So I change the `translate-alist` to include something additional for equations. But I
don't know how to figure out the right "key" for a latex chunk, and how to get its
contents. I need to better understand what the `translate-alist` is actually doing.

[See this code.](file:///Users/peterwills/.emacs.d/elpa/ox-gfm-1.0/ox-gfm.el)

second level shit

how about <span class="underline">underlined stuff</span> 

how about *italicized stuff*

how about **bolded stuff**

How about footnotes?[^fn1] These are a little weird, because they don't get exported in
the correct markdown way - it's kind of an HTML hack, which doesn't inherit all the nice
formatting from Jekyll.


## Here's some content

third level shit

[here's a link](https://google.com)

Here's an equation:

\[ f(x) = \oint g(p) dp \]

Here's some inline math: \(x = y^2\).

The problem is that it renders `\[`, when markdown needs it to render `\\[`. The former just
renders to an open square bracket in the HTML. 


# Does code work?

```python
import numpy as np
np.min(x for x in range(10))  
```


# Here's a table

| Name | Age | Phone |
|---|---|---|
| Peter Wills | 31 | 585 |
| Kathleen Finlinson | 29 | 435 |

Okay looks pretty good there.


<!----- Footnotes ----->

[^fn1]: Schwink!

