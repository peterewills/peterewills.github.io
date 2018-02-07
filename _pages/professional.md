---
header:
  overlay_image: /assets/images/code.jpg
  caption: "Photo credit: [**Marcus Spiske**](https://unsplash.com)"
toc: true
toc_label: "Contents"
permalink: /professional/
---

# Professional

This is a kind of extended resume, going through positions past and
present. I'll try and highlight the interesting aspects of the work, without
getting too technical. Generally I'm unable to go into the nitty-gritty of what
exactly we're doing and how we're doing it, but I'm happy to field any questions
you might have about the things discussed here.

For the bulleted version of my professional life, see [my resume][1]. Order is
reverse chronological, starting wtih my most recent work.

## the Trade Desk

**11/2017 to present**

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
for application of more complex models to capture multi-layered interactions
between data features. I have the enviable task of dreaming up and prototyping
these models. I also provide the mathematical know-how to troubleshoot modeling
and computation issues as they arise.

Our primary technologies are TensorFlow and `scikit-learn`, with the obligatory
smattering of bash and SQL. We containerize with Docker to make sure everything
is reproducible. Our entire workflow is on Amazon Web Services, from loading the
data in S3 to querying with Athena, then building and deploying models with
SageMaker. This exposure to a full-scale industrial workflow has been invaluable
for me.

## Entelligent

**11/2016 to 12/2017**

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

Although I no longer work with the company on a day-to-day basis, I still
consult with them in order to make sure that quarterly index rebalances go
smoothly, and to provide input on any technical projects they're undertaking.

## University of Colorado

**9/2012 to present**

In my time as a graduate student in the [Applied Math department][5] at CU, I
worked almost continuously[^fnote3] as a teaching assistant and instructor. I
have taught classes in single- and multivariable calculus, as well as computer
lab classes on Mathematica and Matlab. My favorite course to teach is definitely
multivariable calculus; I get a kick out of helping the students wrap their head
around the kind of spatial reasoning that this work requires.

I try to use alternative class structures that encourage student participation;
I know from experience that passive learning (i.e. listening to a lecture)
doesn't work. In my classes the students work together while standing at a
blackboard, which helps them stay alert and engaged. In this way, I function as
more of a mentor or a guide than someone who is going to inject them with
mathematical knowledge; the format helps them realize that they'r really
teaching themselves.



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
