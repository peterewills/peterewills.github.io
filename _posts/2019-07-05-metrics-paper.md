---
title: "New Paper on the arXiv!"
category: posts
date: 2019-07-05
---

I just put a [new paper up on the arXiv][1], and so I thought I would share it
here. This was the final paper I wrote for my Ph.D., and it's the one I'm
most proud of, because by this point I was determining the direction that the
research was going.

The paper is called "Metrics for Graph Comparison: a Practitioner's Guide."
It's a survey paper, comparing different tools that can be used to compare
graphs. In research, so many people spend so much time developing new methods,
and I always think to myself, "How does this compare to the standard method? Is
it actually an improvement?" This paper attempts to take stock of a number of
standard and cutting-edge methods in graph comparison, and see what works
best. 

The focus is on practicality, and so we only look at distances that are linear
or near-linear (i.e. $$O(n)$$ or $$O(n \log n)$$) in the number of vertices in
the graph.[^fnote1] We find that spectral methods (which are quite standard,
and have been around for some time) are strong performers all around. They are
robust, flexible, and have the added benefit of easy implementation - fast
spectral algorithms are ubiquitous in modern computing packages such a MATLAB,
SciPy, and Julia. 

I've implemented many of these distances in my Python library [NetComp][2],
which you can get via `pip install netcomp`. Check it out, and feel free to
post issues and/or PRs if you want to add to/modify the library.

Let me know in the comments what you think! Or feel free to email me if you
have more detailed questions about graph metrics. Happy Friday!

<!-------------------------------- FOOTER ----------------------------> 


[1]: https://www.biorxiv.org/content/10.1101/611509v1

[2]: https://www.github.com/peterewills/netcomp

[^fnote1]: This is paired with the assumption that the graph is sparse, so the
    number of edges is $$O(n \log n)$$

<!-- Wish we could put this in _includes/scripts.html. But it doesn't run from -->
<!-- there. It needs to be run at the bottom of the file, rather than at the   -->
<!-- top; perhaps that has something to do with it. Anyways, I'll just include -->
<!-- this chunk of HTML at the footer of all my posts, even though its fugly.  -->

<div id="disqus_thread"></div>
<script>

/**
*  RECOMMENDED CONFIGURATION VARIABLES: EDIT AND UNCOMMENT THE SECTION BELOW TO INSERT DYNAMIC VALUES FROM YOUR PLATFORM OR CMS.
*  LEARN WHY DEFINING THESE VARIABLES IS IMPORTANT: https://disqus.com/admin/universalcode/#configuration-variables*/
/*
var disqus_config = function () {
this.page.url = PAGE_URL;  // Replace PAGE_URL with your page's canonical URL variable
this.page.identifier = PAGE_IDENTIFIER; // Replace PAGE_IDENTIFIER with your page's unique identifier variable
};
*/
(function() { // DON'T EDIT BELOW THIS LINE
var d = document, s = d.createElement('script');
s.src = 'https://pwills-com.disqus.com/embed.js';
s.setAttribute('data-timestamp', +new Date());
(d.head || d.body).appendChild(s);
})();
</script>
<noscript>Please enable JavaScript to view the <a href="https://disqus.com/?ref_noscript">comments powered by Disqus.</a></noscript>
