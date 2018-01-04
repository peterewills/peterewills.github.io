---
permalink: /research/networks/
date: 2018-01-01 10:00 -0700
toc: true
toc_label: "Contents"
---

# Network Data Analysis

## Introduction to Network Data

"Data analysis" is a hugely popular thing these days, for obvious reasons. When
most people think of "data," they think of a table where the columns are
variables and the rows are observations:

Name   | Age | Height | Weight
-------|-----|--------|-------
Fred   | 28  | 6'0"   | 190
Sally  | 24  | 5'8"   | 145
Jimmy  | 52  | 5'6"   | 160
Nicole | 61  | 5"11"  | 155

We might call this "tabular data." We are interested in an alternate form of
data called "networked data," which stores *connections* between entries
(people, computers, etc.). The canonical example of network data is a social
network. If arranged in a table, we would see both rows *and* columns labelled
with names, and entries are marked if the two names are linked in a given social
network (e.g. are "friends" on Facebook).

User   | Fred | Sally | Jimmy | Nicole
-------|------|-------|-------|-------
Fred   |      | X     | X     |
Sally  | X    |       | X     |
Jimmy  | X    | X     |       | X
Nicole |      |       |  X    | 

Such data is often visualized with each user as a dot (called a **vertex**) and
each connection as a line (called an **edge**). The resulting object is called a
**network**.[^fnote1] The table above corresponds to the network seen below:

<img src="{{ "/assets/images/research/network.png" | absolute_url }}"
width="250" align="right">

Looking at this network, we see that the different people have different
"roles," so to speak. Jimmy is central, acting as a **hub**; he is friends with
all other members of the network. Nicole is an **outlier**, so that information
moving around the network might take longer to reach her than other
members. Fred, Sally, and Jimmy form a **clique**, or tightly knit group in which
everyone is connected to everyone else.

This sort of analysis is fundamental to the kind of insights that people want to
get out of network data. Are their communities? How many? Significant hubs? Are certain
groups outliers, or are most of the groups reasonably well connected? Answering
these questions is simple for graphs small enough to draw as we have above; they
are quite challenging for graphs with millions of nodes.

## The Resistance Metric

My first focus in graph analysis was the "graph resistance,"[^fnote1] one of
many ways to quantify the "distance" between two vertices on a graph. Probably
the most obvious way to measure distance between two vertices is to calculate
the length (number of edges) of the shortest path between them. Foe example, in
the image above, the shortest path between Nicole and Sally goes through Jimmy,
and has length 2.

<img src="{{ "/assets/images/research/resistance.png" | absolute_url }}"
width="350" align="left" hspace="20">

This approach is appealing in its simplicity, but has its drawbacks. In the road
network of New York City, for example, the shortest path between Brooklyn and
Manhattan is the same as the shortest path between Brooklyn and Queens. But as
anyone who's been to New York knows, if you're in a car during rush hour, you'd
much rather be driving on the latter route. This is because there are very few
ways to get from Brooklyn to Manhattan; you must cross one of a small number of
bridges. The shortest path distance fails to take these multiple routes into
account. 

The graph resistance treats the network like a set of resistors, and measures
the "distance" between two vertices by measuring the appropriate
resistance.[^fnote2] Resistance is determined by all possible paths that electricity can
flow through a network; in this way the graph resistance takes into account all
possible paths between the two vertices. In our previous example, Brooklyn and
Manhattan would have a much higher resistance than Brooklyn and Queens, because
there are very few paths between them.

In [our paper][1], we extend this idea into a method of comparing two graphs by
looking at their resistance structure, and prove some results about the ability
of the graph resistance to detect changes in communities. In particular, we
focus on using the tool for anomaly detection in networks that change over time
(see the next section for more details), and explore the limiting cases of
sparse network structure where this tool starts to break down. In particular, we
find theoretical limits in which the resistance can detect changes in the
community structure of a graph.


## Anomaly Detection in Network Data

Our current project focuses on techniques for comparing networks.



[^fnote1]: Mathematicians refer to networks as **graphs**, while the term
    **network** is more common with computer scientists. I find the latter to be
    more descriptive, so I'll stick to using it.
	
[^fnote2]: For a more technical introduction, and an excellent overview of basic
    properties, see the paper
    [Effective Graph Resistance](https://www.nas.ewi.tudelft.nl/people/Piet/papers/LAA_2011_EffectiveResistance.pdf).

[1]: https://arxiv.org/abs/1707.07362
