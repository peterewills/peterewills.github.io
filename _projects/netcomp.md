---
permalink: /projects/netcomp/
date: 2018-01-04 10:00 -0700
toc: true
toc_label: "Contents"
---

# NetComp: Python Network Comparison

As I worked on my research on [network data analysis][1], it became clear that
there was a need for a Python library that implemented the analytical tools I
was interested in. The ubiquitous [NetworkX][2] package contains quite a few
metrics, but since it is such a popular package, it does not implement research
algorithms until they reach a high level of maturity. I decided to build
[NetComp][3] in order to bridge this gap. You can get it locally via

	pip install netcomp

## Design Principles

The two guiding principles behind the library are:

- **Flexibility.** Graphs can be input as either dense NumPy or sparse SciPy
  arrays/matrices.
  
- **Speed.** All algorithms must run in linear or near-linear time, and have
  efficient implementations leveraging sparse data structures when appropriate.
  
I opted to utilize arrays as the fundamental data structure of the library,
rather than creating a custom `Graph` class or extending that of NetworkX. This
has some drawbacks in terms of flexibility; NetworkX supports arbitrary vertex
labels and edge properties, whereas using an array implicitly assumes integer
vertex labels. The benefit of such an approach, however, is that we avoid the
costly conversion to and from arrays, which is the format in which networks are
often encountered in application.

## Distances Included in Library

The graph distances included are:

- **Resistance Distance.** Compares networks by looking at differences in their
  resistance structure. Also included is the renormalized resistance distance,
  which extends this metric to disconnected networks and networks of different
  sizes. Our paper studying the properties of the renormalized resistance
  distance can be found [on the arXiv][5].

- **DeltaCon.** Another popular distance, [DeltaCon][4] is comparable to the resistance
  distance. It uses an alternative method of calculating node affinities, and
  then looks compares the resulting structure for the two networks in question. 
  
- **NetSimile.** [NetSimile][7] examines the statistics of a variety of local network
  measures, and compares statistical properties (mean, standard deviation, etc.)
  of these measures. We implement it as originally proposed, but this method is
  highly extensible, and can include any network measure of interest.

- **Spectral Distances.** These distances compare graphs via looking at the
  spectrum (eigenvalues) of the various matrix representations of the graph. The
  most common matrix representation of the graph is the adjacency matrix, but
  this method is also implemented on the Laplacian, both in its normalized and
  unnormalized forms.

- **Graph Edit Distance.** Trivial to calculate, and implemented in NetworkX, but
  we often use it as a baseline, so I included it.
  
Note that the vertex affinity matrices calculated by the resistance distance and
DeltaCon are themselves directly accessible. Also useful is a helper function
`_eigs` which calculates the `k` largest (or smallest) eigenvalues of a
symmetric matrix, using the appropriate method depending on the input data type
(sparse or dense) and the number of eigenvalues to be calculated.[^fnote1]

## Future Work

The library is still in alpha, and is incomplete in its implementation of the
various algorithms. In particular, it lacks the fast implementation of the
resistance distance and DeltaCon, both of which are linear-time approximations
of the quadratic-time exact algorithms. The resistance distance approximation in
particular will rely on proper implementation of an
[algebraic multigrid solver][6] for linear systems, which will be an involved
process to build. I look forward to working on it.

[^fnote1]: This function must be imported directly via `from netcomp.linalg
    import _eigs`

[1]: /research/networks

[2]: https://networkx.github.io/

[3]: https://www.github.com/peterewills/netcomp

[4]: https://arxiv.org/abs/1304.4657

[5]: https://arxiv.org/abs/1707.07362

[6]: http://pyamg.github.io/

[7]: https://arxiv.org/abs/1209.2684
