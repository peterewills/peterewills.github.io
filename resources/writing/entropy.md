# The Meaning of Entropy


**Entropy** is a word that we see a lot in various forms. It's classical use
  comes from thermodynamics: e.g. "the entropy in the universe is always
  increasing." With the recent boom in statistics and machine learning, the word
  has also seen a surge in use in information-theoretic contexts: e.g. "minimize
  the cross-entropy of the validation set." 
  
  It's been an ongoing investigation for me, trying to figure out just what the
  hell this information-theoretic entropy is all about, and how it connects to
  the notion I'm familiar with from statistical mechanics. Reading through the
  wonderful book [Data Analysis: a Bayesian Tutorial][1] by D. S. Sivia, I
  found the first connection between these two notions that really clicked for
  me. I'm going to run through the basic argument here, in the hope that
  reframing it in my own words will help me understand it more thoroughly.
  
  
## Entropy in Thermodynamics

Let's start with the more intuitive notion, which is that of thermodynamic
entropy. This notion, when poorly explained, can seem opaque or quixotic;
however, when viewed through the right lens, it is straightforward, and the law
of increasing entropy becomes a highly intuitive result.

### Counting Microstates

Imagine, if you will, the bedroom of a teenager. We want to talk about the
entropy of two different states: the state of being "messy" and the state of
being "clean." We will call these **macrostates**; they describe the macroscopic
(large-scale) view of the room. However, there are also many different
microstates. One can resolve these on a variety of scales, but let's just say
they correspond to the location/position of each individual object in the
room. To review: 

Type       | Definition             | Example
-----------|------------------------|------------------
Macrostate | Overall Description    | "Messy"
Microstate | Fine-Scale Description | "Underwear on lamp, shoes in bed, etc."

### The Boltzmann Entropy

One might notice an interesting fact: that there are many more possible
microstates that correspond to "messy" than there are microstates that
correspond to "clean." **This is exactly what we mean when we say that a messy
room has higher entropy.** In particular, the entropy of a macrostate is **the
log of the number of microstates that correspond to that macrostate.** We call
this the Boltzmann entropy, and denote it by \\(S_B\\). If there are
\\(\Omega\\) possible microstates that correspond to the macrostate of being
"messy," then we define the entropy of this state as[^fnote2]

$$S_B(\text{messy}) = \log(\Omega).$$

This is essentiall all we need to know here.[^fnote1] The entropy tells us how many
different ways there are to get a certian state. A pyramid of oranges in a
supermarket has lower entropy than the oranges fallen all over the floor,
because there are many configurations of oranges that we would call "oranges all
over the floor," but very few that we would call "a nicely organized pyramid of
oranges." 

In this context, the law of increasing entropy becomes almost tautological. If
things are moving around in our bedroom at random, and we call *most* of those
configurations "messy," then the room will tend towards messyness rather than
cleanliness. We sometimes use the terms "order" and "disorder" to refer to
states of relatively low and high entropy, respectively.

## Entropy in Information Theory

One also frequently encounters a notion of entropy in statistics and information
theory. This is called the *Shannon entropy*, and the motivation for this post
is my persistent puzzlement over the connection between Boltzmann's notion of
entropy and Shannon's. Previous to reading [D. Sivia's manual][1], I only knew
the definition of Shannon entropy, but his work presented such a clear
exposition of the connection to Boltzmann's ideas that I felt compelled to share it.

### Permutations and Probabilities

We'll work with a thought experiment.[^fnote3] Suppose we have \\(N\\) subjects
we organize into \\(M\\) groups, with \\(N\gg M\\). Let \\(n_i\\) indicate the
number of subjects that are in the \\(i^\text{th}\\) group, for
\\(i=1,\ldots,M\\). Of course,

$$\sum_{i=1}^M n_i = N,$$

and if we choose a person at random the probability that they are in group
\\(i\\) is

$$p_i = \frac{n_i}{N}.$$

The **Shannon entropy** of such a discrete distribution is defined as 

$$S = -\sum_{i=1}^M p_i\log(p_i)$$

But why? Why \\(p\log(p)\\)? Let's look and see.

A macrostate of this system is defined by the size of the groups \\(n_i\\);
equivalently, it is defined as the probability distribution. A microstate of
this system is specifying the group of each subject: the specification that
subject number \\(j\\) is in group \\(i\\) for each \\(j=1,\ldots,N\\). How many
microstates correspond to a given macrostate? For the first group, we can fill
it with any of the \\(N\\) participants, and we must choose \\(n_1\\) members of
the group, so the number of ways of assigning participants to this group is 

$${N\choose n_1} = \frac{N!}{n_1!(N-n_1)!}$$

For the second group, there are \\(N - n_1\\) remaining subjects, and we must assign
\\(n_2\\) of them, and so on. Thus, the total number of ways of arranging the
\\(N\\) balls into the groups of size \\(n_i\\) is

$$\Omega = {N\choose n_1}{N-n_1 \choose n_2}\ldots {N-n_1-\ldots-n_{M-1}\choose n_M}. $$

This horrendous list of binomial coefficients can be simplified down to just

$$\Omega =  \frac{N!}{n_1!n_2!\ldots n_M!}.$$

The Boltzmann entropy of this macrostate is then

$$S_B = \log(\Omega) = \log(N!) - \sum_{i=1}^M \log(n_i!)$$

### From Boltzmann to Shannon

**We will now show that the Boltzmann entropy is (approimxately) a scaling of the
Shannon entropy**; in particular, \\(S_B \approx N\,S\\). Things are going to get
slightly complicated in the algebra, but hang on. If you'd prefer, you can take
my word for it, and skip to the next section.

We will use the Stirling approximation \\(\log(n!)\approx n\log(n)\\)[^fnote4]
to simplify:

$$S_B \approx N\log(N) - \sum_{i=1}^M n_i\log(n_i)$$

Since the probability \\(p_i=n_i/N\\), we can re-express \\(S_b\\) in terms of
\\(p_i\\) via 

$$S_B \approx N\log(N)-N\sum_{i=1}^M p_i\log(Np_i)$$

Since \\(\sum_ip_i=1\\), we have

$$S_B \approx -N\sum_{i=1}^M p_i\log(p_i) = N \, S.$$

Phew! So, the Boltzmann entropy \\(S_b\\) of having \\(N\\) students in \\(M\\)
groups with sized \\(n_i\\) is (approximately) \\(N\\) times the Shannon
entropy.

## Who Cares?

Admittedly, this kind of theoretical revalation will probably not change the way
you deploy cross-entropy in your machine learning projects. It is primarily used
because its gradients behave well, which is important in the stochastic
gradient-descent algorithms favored by modern deep-learning
architectures. However, I personally have a strong dislike of using tools that I
don't have both a theoretical understanding of; hopefully you now have a better
grip on the theoretical underpinnings of cross entropy, and its relationship to
statistical mechanics.


<!-------------------------------- FOOTER ----------------------------> 

[1]: https://www.amazon.com/Data-Analysis-Bayesian-Devinderjit-Sivia/dp/0198568320

[^fnote2]: Often a constant will be included in this definition, so that
    \\(S=k_B \log(\Omega)\\). This constant is arbitrary, as it simply rescales
    the units of our entropy, and it will only serve to get in the way of our
    analysis, so we omit it.
	
[^fnote1]: All we need to know for the purpose of establishing a connection
    between thermodynamic and information-theoretic entropy; of course there is
    much more to know, and there are many alternative ways of conceptualizing
    entropy. However, none of these have ever been intuitive to me in the way
    that Boltzmann's definition of entropy is.

[^fnote3]: We have slightly rephrased Sivia's presentation to fit our purposes here.

[^fnote4]: The most commonly used form of Stirling's approximation is the more
    precise \\(\log(n!)\approx n\log(n)-n\\), but we use a coarser form here.
