---
title:  "Data Science Interview Study Guide Part I: Statistics"
category: posts
date: 2019-04-22
---

As I have gone through a couple rounds of interviews for data scientist
positions, I've been compiling notes on what I consider to be the essential
areas of knowledge. I want to make these notes available to the general public;
although there are many blog posts out there that are supposed to help one
prepare for data science interviews, I haven't found any of them to be very
high-quality. 

From my perspective, there are four key subject areas that a data scientist
should feel comfortable with when going into an interview:

1. Statistics (including experimental design)
2. Machine Learning
3. Software Engineering (including SQL)
4. "Soft" Questions

I'm going to go through each of these individually. This first post will focus
on statistics. We will go over a number of topics in statistics in no particular
order. Note that **this post will not teach you statistics; it will remind you
of what you should already know.**

If you're utterly unfamiliar with the concepts I'm mentioning, I'd recommend
[this excellent MIT course on probability & statistics][1] as a good starting
point. When I began interviewing, I had never taken a statistics class before; I
worked through the notes, homeworks, and exams for this course, and at the end
had a solid foundation to learn the specific things that you need to know for
these interviews.

Of course, this should all be taken with a grain of salt; I've been in the
industry a relatively short time, and haven't done very many interviews. I hope
to improve this guide over time; please let me know in the comments if there's
something you think should be added, removed, or changed!

# The Central Limit Theorem

**Example question: What is the central limit theorem? Why is it useful?**

The Central Limit Theorem is a fundamental tool in statistical analysis. It
state (roughly) that when you add up a bunch of random variables with finite
variance, then their sum will converge to a Gaussian distribution.[^fnote1]

What does this mean to a data scientist? Well, one place where we see a sum of
random variables is in a _sample mean_. One consequence of the central limit
theorem is that the sample mean of a variable with mean $$\mu$$ and variance
$$\sigma^2$$ will itself have mean $$\mu$$ and variance $$\sigma^2/n$$, where
$$n$$ is the number of saples.

This is cool! We don't need to know much of anything about the distribution of
we're sampling from, besides its mean and variance. This simplification will
allow us to do hypothesis testing that compares two means with relative ease.

# Hypothesis Testing

**Example question: 47 out of 100 people clicked the blue button. 26 out of 50
  clicked the green button. How confident are you that the green button is
  better than the blue button?**

Hypothesis testing is a huge subject, both in scope and importance. We use
statistics to quantitatively answer questions based on data, and hypothesis
testing is the method by which we construct these answers. Here we'll just lay
out one possible case of a hypothesis test. It's simple, but it comes up all the
time in practice, so it's essential to know.

## An Example

Suppose we have two buttons, one green and one blue. We put them in front
of two different samples of users. For simplicity, let's say that each sample
has size $$n=100$$. We observe that $$k_\text{green}$$ 57 users click the green button, and only
$$k_\text{blue} = 48$$ click the blue button.

Seems like the green button is better, right? Well, we want to be able to say
how _confident_ we are of this fact. We'll do this in the language of null
hypothesis significance testing. I'm going to lay out a table of all the
important factors here, and then discuss

| Description | Value |
|------------|-------|
| Null Hypothesis| $$p_{blue} - p_{green} = 0$$ |
| Test Statistic | $$ \frac{k_\text{blue}}{n} - \frac{k_\text{green}}{n} $$ |
| Test Statistic's Distribution | $$N(0, (p_b(1-p_b) + p_g(1-p_g)) / n)$$ |
| Test Statistic's Observed Value | -0.09 | 
| $$p$$-value | 0.1003 |

There are a few noteworthy things here. First, we really want to know whether
$$p_g > p_b$$, but that's equivalent to $$p_b-p_g < 0$$. Second, we assume that
$$n$$ is large enough so that $$k/n$$ is approximately normally distributed,
with mean $$\mu = p$$ and variance $$\sigma^2 = p(1-p)/n$$. Third, since the
differences of two normals is itself a normal, the test statistics distribution
is (under the null hypothesis) a normal with mean zero and the variance given
(which is the sum of the two variances of $$k_b/n$$ and $$k_g/n$$). 

Finally, we don't actually know $$p_b$$ or $$p_g$$, so we can't really compute
the $$p$$-value; what we do is we say that $$k_b/n$$ is "close enough"" to
$$p_b$$ and use it as an approximation. That gives us our final $$p$$-value.

The $$p$$-value was calculated in Python, as follows:

{% highlight python %}
from scipy.stats import norm
pb = 0.48
pg = 0.57
n = 100
sigma = np.sqrt((pb*(1-pb) + pg*(1-pg))/n)
norm.cdf(-0.09, loc = 0, scale = sigma) # 0.10034431272089045
{% endhighlight %}

Phew! I went through that pretty quick, but if you can't follow the gist of what
I was doing there, I'd recommend you think through it until it is clear to
you. You will be faced with more complicated situations in practice; it's
important that you begin by understanding the most simple situation inside out.

## Other things to know

You should know about Type I & II error. What are they? What is a situation
where you would be more concerned with Type I error? Vice versa?

You should know what the _power_ of a test is, and how to calculate it. To
calculate the power, you need an alternative hypothesis; in the example above,
this would look like $$p_b-p_g = -0.1$$. Although these alternative hypothesis
are often somewhat ad-hoc, the power analysis depends critically upon them.

You should know what the _significance_ of a test is. This is the same as the
$$p$$-value threshold below which we reject the null hypothesis. (In)famously,
0.05 has become the de-facto standard throughout many sciences for significance
levels worthy of publication.

Speaking of $$p$$-values, you should understand them thoroughly. A very common
question is **how would you explain a p-value to a lay person**? For what it's
worth, I'm not convinced there's a great answer to that one; it's an inherently
technical quantity that is frequently misrepresented and abused by people trying
to (falsely) simplify its meaning.

**Bonus example question: If you measure 14 different test statistics, and get a
  $$p$$-value for each (all based on the same null hypothesis), how do you
  combine them to get an aggregate $$p$$-value?**
  
# Confidence Intervals

Confidence intervals allow us to say how certain we are of a result. If we count
that 150 out of 400 people sample randomly from a city are female, then our best
estimate of the gender ratio in that city is 250/150, or 5/3; but how certain
are we of this fact?






<!-------------------------------- FOOTER ----------------------------> 


[1]: https://ocw.mit.edu/courses/mathematics/18-05-introduction-to-probability-and-statistics-spring-2014/index.htm

[^fnote1]: Of course, the actual statement is careful about the mode of
    convergence, and the fact that it is actually an appropriately-normalized
    version of the distribution that converges, and so on.

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
