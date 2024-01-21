---
title: Grouping images by Colours - Exploring Colour-Based Image Clustering
description: The idea for this experimental project, which I am going to demonstrate in this blog article, came to me from the Office Works website. Here's how it all happened. As a hobbyist landscape photographer, I have accumulated hundreds of images over the years. Recently, I decided to print these photos in a 10x12" photo book. I immediately checked the Office Works website to see if they offer such a service, and I was in luck. Office Works has an incredible platform that allows customers to easily create photo books using their online editor. While I was able to accomplish what I wanted, there was one feature that I was missing but would be nice to have the ability to sort all of the images based on their colours. In my case, I uploaded 160 images, and manually sorting all of them was a bit tedious.
image: https://res.cloudinary.com/suv4o/image/upload/q_auto,f_auto,w_1200,e_sharpen:100/v1697956564/blog/grouping-images-by-colours/ot79c0slnfykfnvy5i9e
keywords:
    - LangChain
    - AI
    - Python
    - Artificial Intelligence
    - ML
    - Machine Learning
    - Chat GPT
    - Image Classification
    - Web Development
    - Development
type: article
published: 23rd October 2023
readTime: 8
author: Aleksandar Trpkovski
articleTags:
    - Python
    - LangChain
    - AI
---

# Grouping images by Colours - Exploring Colour-Based Image Clustering

_{{$document.published}} • {{$document.readTime}} min read — by **[{{$document.author}}](/)**_

::tag-pills{:tags="articleTags"}
::

![Landing Image](https://res.cloudinary.com/suv4o/image/upload/q_auto,f_auto,w_750,e_sharpen:100/v1697956564/blog/grouping-images-by-colours/ot79c0slnfykfnvy5i9e.jpg)

The idea for this experimental project, which I am going to demonstrate in this blog article, came to me from the Office Works website. Here's how it all happened.

As a hobbyist landscape photographer, I have accumulated hundreds of images over the years. Recently, I decided to print these photos in a 10x12" photo book. I immediately checked the Office Works website to see if they offer such a service, and I was in luck. Office Works has an incredible platform that allows customers to easily create photo books using their online editor.

While I was able to accomplish what I wanted, there was one feature that I was missing but would be nice to have: the ability to sort all of the images based on their colours. In my case, I uploaded 160 images, and manually sorting all of them was a bit tedious.

As a software developer, I thought that this would be an interesting side project to see how far I could go in implementing this kind of sorting and grouping of images based on their colours hues. So here is how it all went.

## The Problem

To demonstrate this example, I will use the 10 photos shown in the image below:

![Original Images](https://res.cloudinary.com/suv4o/image/upload/q_auto,f_auto,w_750,e_sharpen:100/v1697965697/blog/grouping-images-by-colours/knfc7u1v025fbbuycq2m)

The photos shown in the image are not sorted based on their hues, resulting in an unpleasing visual arrangement. It would be better if the photos were categorised into three groups based on their colour hues, as demonstrated in the subsequent image.

![Groped Images](https://res.cloudinary.com/suv4o/image/upload/q_auto,f_auto,w_750,e_sharpen:100/v1697965670/blog/grouping-images-by-colours/hpepiyqamctzegdz8ttn)

While it is not a big deal when we have just 10 images, as we can easily group them manually, it becomes a much bigger job when we have 160, as was the case for me. Some sort of automation would be very helpful in this situation.

## The solution

For my solution to automatically sort images based on hues, I utilised several technologies. In the following sections, I will provide a detailed explanation of how each technology was implemented. Here is a brief overview of the technologies used:

-   [Python](https://www.python.org/) (programming language)
-   [LangChain](https://www.langchain.com/) (framework for working with LLMs)
-   [ChatGPT](https://chat.openai.com/) 3.5 turbo (LLM)
-   [SentenceTransformer](https://www.sbert.net/) with the `all-MiniLM-L6-v2` open source model (used for generating embeddings to calculate similarities)

The diagram below provides an overview of the implementation. Lets analyse each step of the diagram in more detail below.

![Diagram - Grouping images by Colours - Exploring Colour-Based Image Clustering](https://res.cloudinary.com/suv4o/image/upload/q_auto,f_auto,w_750,e_sharpen:100/v1697966006/blog/grouping-images-by-colours/n0d2cdowobpbp6tbk1xb)

### Extract Colours from a photo using KMeans clustering

In the first step, each photo is loaded, and then each pixel is analysed using several Python libraries that help accomplish this, such a `scikit-learn`, `opencv-python`, `numpy`, and `pillow`. Then each pixel is assigned to one of the 5 clusters, represented by a hex value, using KMeans. Increasing the number of clusters results in more accurate classifications, but it also affects the processing speed, resulting in slower processing time. We stick with 5 clusters since they are more than enough for our purpose. I also tried classification with 10 clusters, but that resulted in doubling the processing time. I will share some time comparisons in the later section of this document.

The image below shows how the hues of a photo are grouped into 5 clusters with different hex colours values.

![Clusters](https://res.cloudinary.com/suv4o/image/upload/q_auto,f_auto,w_750,e_sharpen:100/v1697966134/blog/grouping-images-by-colours/mkubxeofuui2juhl3k0y)

This implementation that I used here is part of an open source project I found on Hugging Face [here](https://huggingface.co/spaces/Shamima/extract-color-from-image). The author of the project, Shamima Hossain, has done an amazing job implementing this. She has also contributed to a lot of open source projects regarding AI and ML work. If you are interested, you can find her work on GitHub [here](https://github.com/silvererudite) or follow her on [Twitter](https://twitter.com/ShamimaHossai13).

## Colour classification

To group the photos based on their most used hex colours, we need to consider that it is unlikely for two photos to have identical hex values. Therefore, we will categorise the photos into similar colour groups based on their hues.

To accomplish this task, we need a comprehensive list of colours that covers the entire spectrum. To obtain the list, I asked chat GPT to provide it for me. My exact question was as follows:

“**_Give me a list of colours different variations from all spectrum. I am going to use this colour labels to classify hex colours. Give me as many colour labels as possible. Including white and black variations.”_**

The response was the following list of colours that are shown in the image below:

![Entire Spectrum](https://res.cloudinary.com/suv4o/image/upload/q_auto,f_auto,w_750,e_sharpen:100/v1697966229/blog/grouping-images-by-colours/vtsor7rqjbxno6dux7gf)

The next step is to categorise the hex values of each photo into one of the mentioned colours names.

To accomplish this task, I utilised the OpenAI function with the LangChain framework. The language model used was Chat GPT. The prompt and the structure of the JSON output were as follows:

```python
[
     (
         "system",
         "You are a hex colour to colour name converter. You are given a hex colour and you must return the colour name. The hex colour must belong in one of the following descriptive colour labels: Red, Crimson, Scarlet, Vermilion, Maroon, Rose, Pink, Magenta, Fuchsia, Purple, Lavender, Indigo, Blue, Navy, Azure, Cyan, Teal, Turquoise, Green, Emerald, Lime, Chartreuse, Olive, Yellow, Gold, Amber, Orange, Peach, Apricot, Brown, Sienna, Chocolate, Tan, Beige, Khaki, Gray, Silver, Charcoal, White, Ivory, Cream, Pearl, Platinum, Jet Black, Onyx Black",
     ),
     ("human", "Use the given hex color to classify into a colour name: {input}"),
     ("human", "Tip: Make sure to use the labels that were provided to classify the colour."),
 ]

json_schema = {
    "title": "Colour",
    "description": "Convert a hex colour to a colour name",
    "type": "object",
    "properties": {
        "colour_name": {"type": "string", "description": "The colour name"},
        "hex_colour": {"type": "string", "description": "The hex colour"},
    },
    "required": ["colour_name"],
}
```

Based on the earlier shown image, we proceeded to group each hex colour using the Open AI function. The result was as follows:

![Clusters-2](https://res.cloudinary.com/suv4o/image/upload/q_auto,f_auto,w_750,e_sharpen:100/v1697966349/blog/grouping-images-by-colours/gwpg8rwo4x9gutthnucr)

## Photo group classification using embeddings

The last step is to compare the similarities between each photo based on the colour grouping we did in the previous section. This can be easily accomplished by converting the colour names into embeddings and comparing them using a similarity score. To do this, we utilise a Python library called SentenceTransformer, along with an open-source model called `all-MiniLM-L6-v2`, which I have locally served.

The number of clusters was specified to be 3, since the number of photos in this example is relatively small (only 10 photos).

# Performance

For this example, I used several different setups to measure the time it takes to run the photo grouping:

-   10 photos with a resolution of 1024px on the longer side and 5 colour clusters: 157.10 seconds
-   10 photos with a resolution of 2048px on the longer side and 5 colour clusters: 210.68 seconds
-   10 photos with a resolution of 2048px on the longer side and 10 colour clusters: 397.74 seconds
-   14 photos with a resolution of 2048px on the longer side and 10 colour clusters: 1029.08 seconds

I used my personal machine, which has an Apple M1 Max with 64GB of memory. As expected, the performance was slower when using higher photo resolutions and more clusters.

# Resources

-   Project GitHub repository: https://github.com/Suv4o/image_classification_based_on_colours
-   Shamima Hossain - Extract colours from an image using KMeans clustering: https://huggingface.co/spaces/Shamima/extract-color-from-image
-   Hugging Face - `all-MiniLM-L6-v2` model: https://huggingface.co/sentence-transformers/all-MiniLM-L6-v2
