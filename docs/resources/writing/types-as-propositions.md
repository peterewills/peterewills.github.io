# Types as Propositions


Some of the most meaningful mathematical realizations that I've had have been
unexpected connections between two topics; that is, realizing that two concepts
that first appeared quite distinct are in fact one and the same. In our first
linear algebra courses, we learn that manipulations of matrices is, in fact,
equivalent to solving systems of equations. In quantum mechanics, we see that
[physically observable quantities][1] are, mathematically speaking, linear
operators (I still don't quite grok this one). And, my personal favorite
example, we learn in functional analysis that the linear functionals in the dual
space of a Hilbert space are themselves in perfect correspondence with the
functions in the original space.[^fnote1]

Recently, I've stumbled upon another such result, which has captured my
attention for a while. The result, often referred to as Curry-Howard
correspondence, is the statement that propositions in a formal logical system
are equivalent to types in the simply typed lambda calculus. Loosely, this means
that **logical statements are equivalent to data types**! 

Let's unpack that a bit; "propositions" are just statements in a logical
system.[^fnote15] In mathematics, for example, one might put forward the
proposition "no even numbers are prime," or "14 is greater than 18". Note that
propositions need not be _true_; in fact, some logical systems support
propositions that cannot even be determined to be true or false.[^fnote2]
"Types" can be though of as types in a computing language; `Integer`, `Boolean`,
and so on. We will have much more to say about types as we move forward, but for
now, hold in your mind the conventional notion of types as defined in a language
such as Java or Python (or better yet, Haskell).

How on earth could these two be in correspondence? On the surface, they appear
entirely separate concepts. In this post, I'll spend some time unpacking what
this equivalence is actually saying, using a simple example. I am far from a
full understanding of it, but as usual, I write about it in the hopes that I'll
be forced to clarify what I _do_ understand, or even better, be corrected by
someone more knowledgable than myself.

Speaking of those more knowledgable than myself, there are various resources
online that I found very helpful in understanding the correspondence:
[Philip Wadler's talk][3] on the subject is a great starting point, and there
are a number of [useful][4] [discussions][5] [available][6] on StackExchange and
various functional programming forums.

## An Example

I was confused by the idea of propositions as types when I first encountered it,
and after learning more, I believe that the root of my confusion lies in the
fact that types such as `Integer`, `Boolean`, and `String`, which we are
familiar with from programming, correspond to very trivial propositions, making
them poor examples. We'll have to introduce something a bit fancier; a
_conditional type_. For example, `OddInt` might be odd Integers, and `PrimeInt`
might be prime integers. We'll approximate these conditional types with custom
classes in Scala. Classes and types are [different beasts][65], of course, but
we will ignore that distinction in this post.[^fnote3]

Let's consider one conditional type in particular: `BigInteger`. This type
(actually a class in this example) is defined as follows:

{% highlight scala %}
class BigInteger (val value: Int) {

  private final val LOWER_BOUND = 10000
  
  if (value < LOWER_BOUND) {
    throw new IllegalArgumentException("Too small!")
  }
  
  override def toString = s"BigInteger($value)"

}
{% endhighlight %}

One could then instantiate a `BigInteger` as follows:

{% highlight scala %}
val big = new BigInteger(10001)
// res0: BigInteger(10001)

val small = new BigInteger(500)
// java.lang.IllegalArgumentException: Too small!
{% endhighlight %}

Now the fundemanetal question: what proposition corresponds to this type?  In
simple scenarios like this, the corresponding proposition is that the type can
be _inhabited_; that is, there exists a value that satisfies that type. For
example, the type `BigInteger` corresponds to the claim "there exists an integer
\\(i\\) for which \\( i > 10,000 \\)". Obviously, such an integer exists, and the
fact that we can instantiate this type indicates that it corresponds to a true
proposition. Alternatively, consider a type `WeirdInteger`, which is an integer
satisfying `i < 3 && i > 5`. We can define the type well enough, but there are
no values which satisfy it; it is an uninhabitable type, and so corresponds to a
false proposition.

## Functions and Implication

Let's make things a little more interesting. In programming languages, there are
not only primitive types like `Integer` and `Boolean`, but there are also
**function types**, which are the types of functions. For example, in Scala, the
function `def f(x: Int) = x.toString` has type `Int => String`, which is to say
it is a function that maps integers to strings. 

What sort of propositions would _functions_ correspond to? It turns out that
functions naturally map to _implication_. In some ways, the correspondence here
is very natural. Consider the conditional type `BigInteger`, and the conditional
type `BiggerInteger`. The definition of the latter should look familiar, from
above:


{% highlight scala %}
class BiggerInteger (val value: Int) {

  private final val LOWER_BOUND = 20000
  
  if (value < LOWER_BOUND) {
    throw new IllegalArgumentException("Too small!")
  }
  
  override def toString = s"BiggerInteger($value)"

}
{% endhighlight %}

Now, we can write a function that maps `BigInteger` to `BiggerInteger`:

{% highlight scala %}
def makeBigger(b: BigInteger): BiggerInteger = 
  new BiggerInteger(b.value * 2)
{% endhighlight %}

Recall that the proposition corresponding to the type `BigInteger` is the
statement "there exists an integer greater than 10,000", and the proposition
corresponding to `Bigger` is the statement "there exists an integer greater than
20,000"; the proposition corresponding to the function type `BigInteger =>
BiggerInteger` is then just the statement "the existence of an integer above
10,000 implies the existence of an integer above 20,000". And note that, as it
should be for an implication, we do not care whether there actually _does_ exist
an integer above 10,000; we simply know that _if_ one exists, then its existence
implies the existence of an integer above 20,000. 

To be a bit more explicit, the function that we wrote above can be thought of as
a **proof** of the implication; in particular, if we suppose that there exists
an \\(i\\) such that \\(i > 10,000\\), then clearly \\(2i > 20,000\\), and so
if we let \\(j=2i\\), then we have proven the existence of a \\(j\\) such that
\\(j > 20,000\\). This is what the theoretical computer scientists mean when
they say that "programs are proofs".

Of course, Scala is not a proof-checking language, and cannot tell during
compilation that the function `makeBigger` is valid; we would need a much richer
type system to be able to validate such functions. Consider that the following
function compiles with no problem, although there are no input values for which
it will not throw a (runtime) exception:

{% highlight scala %}
def wonky(b: BigInteger): BiggerInteger = 
  new BiggerInteger(b.value % 1000)
{% endhighlight %}

### Wait... what?

If you think about it a bit more, it's sort of a weird example; you
could map _any_ type to `BiggerInteger`, just by doing `def f[A](a:A):
BiggerInteger = new BiggerInteger(20001)`. This is because the proposition that
corresponds to `BiggerInteger` is true (the type is inhabitable), and if B is
true, then A implies B for any A at all.

Common languages such as Haskell only express very trivial propositions with
their types; there does exist one uninhabitable type (`void`), but I have not
found much use for it in practice. The benefit of using conditional types for
these examples is that we can explore at least some types which have
corresponding _false_ propositions, such as `WeirdInteger`, which are integers
`i` which satisfy `i < 3 && i > 5`.

## In Conclusion

Seeing all this, you can begin to get a sense of how computer-assisted proof
techniques might arise out of it. If the fact that a program compiles is
equivalent to the truth the corrsponding proposition, then all we need is a
language with a rich enough type system to express interesting
statements. Examples of languages used in this way include [Coq][8] and
[Agda][9]. A thorough discussion of such languages is beyond both the scope of
this post and my understanding.

I think what keeps me interested in this subject is that it still remains quite
opaque to me; I've struggled to even come up with these simple (and flawed)
examples of how Curry-Howard correspondence plays out in practice. I hope that
anyone reading this who understand the subject better than I do will leave a
detailed list of my misunderstandings, so that I can better grasp this
mysterious and fascinating topic.



<!-------------------------------- FOOTER ----------------------------> 


[1]: https://en.wikipedia.org/wiki/Observable

[2]: https://en.wikipedia.org/wiki/Decidability_(logic)

[3]: https://www.youtube.com/watch?v=IOiZatlZtGU&t=1176s

[4]: http://lambda-the-ultimate.org/node/1532

[5]: https://stackoverflow.com/questions/2969140/what-are-the-most-interesting-equivalences-arising-from-the-curry-howard-isomorp

[6]: https://stackoverflow.com/questions/2829347/a-question-about-logic-and-the-curry-howard-correspondence

[65]: https://stackoverflow.com/questions/5031640/what-is-the-difference-between-a-class-and-a-type-in-scala-and-java

[7]: https://en.wikipedia.org/wiki/Natural_deduction

[8]: https://coq.inria.fr/

[9]: https://en.wikipedia.org/wiki/Agda_(programming_language

[10]: https://github.com/Microsoft/TypeScript/pull/21316

[^fnote1]: This statement is difficult to understand without background in
    functional analysis, but it is in fact one of the most beautiful examples of
    such an equivalence result.
	
[^fnote15]: I'm being a bit sloppy here. The type of logic we're talking about
    here is not classical logic, but rather in the sense of [natural deduction][7].
	
[^fnote2]: Such systems are called undecidable; see
    [the wiki entry on decidability][2] for more information.
	
[^fnote3]: We won't be careful about whether the idea of conditional types
    presented here corresponds well with conditional types as they are actually
    implemented in programming languages such as [Typescript][10].
