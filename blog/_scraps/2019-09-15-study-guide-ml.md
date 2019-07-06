---
title: "Data Science Study Guide Part II: Machine Learning"
category: posts
date: 2019-09-15
---

# TODO

Rework this, and make it consistent with the stats one. Maybe skip this for now
and just do the coding one? It'll be much easier.

Data science interviews tend to focus on four main topics: computer science
(coding), statistics, machine learning, and databases (SQL). I've been building
an archive of learning materials that I go through whenever I'm preparing for an
interview, so I figured I would share it here. The plan is to go through each of
the four topics individually, and outline the material that one should be
familiar with before walking into a data science interview.

I'm not going to go into much depth. In most instances, I'll just touch on the
topics to know, rather than do much explanation. For example, if there's a
bullet point that says "Naive Bayes Classifier", you should ask yourself: do I
understand the basics of how that model works? Could I speak intelligently about
it if asked? Do I know when it is and is not applicable? This guide is more of a
skeleton of what you need to know - to flesh it out, you'll have to go to
secondary sources, such as textbooks, Wikipedia, and other online resources.

For no particular reason, we'll start with machine learning. 

## Once Upon a Time, There Was Some Data...


# Classification

## Logistic Regression

Logistic regression is closely related to linear regression, although it is
important in a few key ways. Logistic regression is a classification
algorithm - it tries to determine the probability that a data point is in one
of two classes. Since there are only two classes, it only needs to predict a
single probability. What it actually does is predict the probability in
logit-space; rather than predicting $$p$$, it predicts

$$\log\left(\frac{p}{1-p}\right)$$

While this might seem confusing, you can just think of these as different
"units" on probability. Odds ($$p/1-p$$) are another kind of units that are
useful - logits (and odds, in fact) are nice because the vary between $$\pm
\infty$$ rather than just in $$[0,1]$$.

One key difference between linear regression and logistic regression is that
our training data 


<!-------------------------------- FOOTER ----------------------------> 



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

