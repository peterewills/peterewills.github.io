---
header:
  overlay_image: /assets/images/code.jpg
  caption: "Photo credit: [**Marcus Spiske**](https://unsplash.com)"
toc: true
toc_label: "Contents"
permalink: /professional/
---

# Professional

On this page I'll go through the gist of what I've done in various professional
roles in the past. I'll try and highlight the interesting parts of the job,
without getting too technical; for the bulleted version, see
[my resume][1]. Order is reverse chronological, starting wtih my most recent
work.

## the Trade Desk

[The Trade Desk][2] is a company that runs a software platform which interprets
user data to bid on advertising space on the web.[^fnote1] They process over 7
millions bids each second, and their algorithms have a maximum latency on the
order of milliseconds, as all the processing must happen as the webpage
loads. They build algorithms that determine the value of advertising space based
on user information, cookies, and the like.

I got brought on by the head of the research and developement team to
collaborate on exploring applications of nonlinear models, with a particular
focus on applying deep learning frameworks such as TensorFlow. Currently they
mostly employ linear models, due to the simplicity of presentation and speed of
processing. However, with the huge amount of data available, the field is ripe
for application of more complex models. I have the enviable task of dreaming up
and prototyping these models. I also provide the mathematical know-how to
troubleshoot modeling and computation issues as they arise.

Our primary technologies are TensorFlow and scikit-learn, with the obligatory
smattering of bash and SQL. We containerize with Docker to make sure everything
is reproducible. Our entire workflow is on Amazon Web Services, from loading the
data in S3 to querying with Athena, then building and deploying models with
SageMaker. This exposure to a full-scale industrial workflow has been invaluable
for me.

## Entelligent

[Entelligent][3] works to synthesize financial and envioronmental data in a way
that provides market insights that would otherwise be invisible. This is done by
combining traditional techniques from financial analysis with modeling and
dynamics insights provided by the [En-ROADS climate model][4]. Just before my
departure in October 2017, we published the Smart Climate index (ticker SCLMX)
which is available on Bloomberg and Thompson Reuters terminals.

While working with Entelligent, I provided expertise in modeling, optimization,
and computer science. I built Entellan,[^fnote2] the Python library which is the
technical backbone of the Smart Climate index. I enjoyed working in the small,
agile environment, where I got to wear many hats and take up issues directly
with the CEO.

## University of Colorado

In my time as a graduate student in the [Applied Math department][5] at CU, I
worked almost continuously[^fnote3] as a teaching assistant and instructor. I
have taught classes in single- and multivariable calculus, as well as computer
lab classes on Mathematica and Matlab. My favorite course to teach is definitely
multivariable calculus; I get a kick out of helping the students wrap their head
around the kind of spatial reasoning that this work requires.



[1]: /assets/docs/resume.pdf

[2]: https://www.thetradedesk.com/about

[3]: https://www.entelligent.com/

[4]: https://www.climateinteractive.org/tools/en-roads/

[^fnote1]: This field is often referred to as "ad-tech."

[^fnote2]: As is often the case in the financial world, the code here is not
    open source.
	
[^fnote3]: I worked as a research assistant at NIST from Summer 2012 through
    Spring 2013 semesters. See [this project](/research/qm_stats/) in the research
    section.
