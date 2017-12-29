---
header:
  overlay_image: /assets/images/code.jpg
  caption: "Photo credit: [**Marcus Spiske**](https://unsplash.com)"
toc: true
toc_label: "Contents"
permalink: /professional/
---

# Professional

Here I outline the gist of what I've done in various professional roles in the
past. Order is reverse chronological, starting wtih my most recent work. This is
not an exhaustive list of positions I've held, but rather those that have most
significantly influenced my thinking and abilities. 

I'll try and highlight the interesting parts of the job, without getting too
technical. For the bulleted version, see [my resume][1].

## the Trade Desk

[The Trade Desk][2] is a company that runs a software platform which interprets
user data to bid on advertising space on the web.[^fnote1] I got brought on by
the head of the research and developement team to collaborate on exploring
applications of nonlinear models, with a particular focus on applying deep
learning frameworks such as TensorFlow. The opportunity is ripe for application
of such models; the training data required for such models is often prohibitive,
but TTD collects and processes over 7 million bids per second!

I'm having a lot of fun working on this project, because I get to learn so
much. I had never had any hands-on experience in the nitty-gritty of building
and deploying neural networks up until now, and in particular had no experience
in the dataflow paradigm of coding that I'm learning through TensorFlow. It's
really a whole new way to think about doing computations! To make things even
more interesting, our entire workflow is on Amazon Web Services, from loading
the data in S3 to querying with Athena, then building and deploying models with
SageMaker. 

## Entelligent

[Entelligent][3] works to synthesize financial and envioronmental data in a way
that provides market insights that would otherwise be invisible. This is done by
combining traditional techniques from financial analysis with modeling and
dynamics insights provided by the [En-ROADS climate model][4]. Just before my
departure in October 2017, we published the Smart Climate index (ticker SCLMX)
which is available on Bloomberg and Thompson Reuters terminals.

While working with Entelligent, I provided expertise in modeling, optimization,
and computer science. I built Entellan,[^fnote2] the Python library which is the
technical backbone of the Smart Climate index. I loved working in the small,
agile environment, where I got to wear many hats and take up issues directly
with the CEO.

## University of Colorado

In my time as a graduate student in the Applied Math department at CU, I worked
almost continuously as a teaching assistant and instructor. I have taught
classes in single- and multivariable calculus, as well as computer lab classes
on Mathematica and Matlab. 

[1]: /assets/docs/resume.pdf

[2]: https://www.thetradedesk.com/about

[3]: https://www.entelligent.com/

[4]: https://www.climateinteractive.org/tools/en-roads/

[^fnote1]: This field is often referred to as "ad-tech."

[^fnote2]: As is often the case in the financial world, the code here is not
    open source.
