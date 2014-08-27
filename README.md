## Pixelbox 2 - An APE Server Demo

!!! THIS IS STILL A WORK IN PROGRESS. EXPECT STUFF NOT TO WORK !!!

Pixelbox 2 is based on the initial [APE Server](https://github.com/APE-Project/APE_Server) Pixelbox demo. It was created as a modern remplacement to the old demo on the [official APE Project website](http://ape-project.org/).

The new version was created with the goal to serve as an example of how an existing code or app could be easilly extented using APE to provide new features and realtime interactivity. In this repository, you'll the file ``pixelbox.html`` which is vanilla version of Pixelbox running without APE. The files ``pixelbox-APS.html`` and ``pixelbox-JSF.html`` are interactive version of the same basic javascript app using the power of [APE Server](https://github.com/APE-Project/APE_Server) to allow multiple client to draw on the same canvas in **realtime**.


The purpose of this demo is also to present the differences between [APE JSF](https://github.com/APE-Project/APE_JSF) (``pixelbox-JSF.html``) and [ApePubSub](https://github.com/ptejada/ApePubSub) (``pixelbox-APS.html``), two different [APE Server](https://github.com/APE-Project/APE_Server) Clients. For more informations about both clients, you can refer to the [Move Demo](https://github.com/lcharette/JSF-vs.-APS---Move-demo) which contain a detailled guide explaining the differences between both APE Clients.


## Which features are used?

* Serverside Javascript: ``Pixelbox2.js``
* Serverside MySQL Support
* Serverside OS Functions
* Sessions

The demo also uses *jQuery* as base Javascript Framwork, *jCanvas* for Canvas manipulation and *Colpick* for the color picker.

## What's special?
In one word, this demo is the god of all APE demos since it include multiple key features of APE.

This PixelBox demo make full use of the APE Server sessions feature. With both clients, you can turn on and off sessions (refer to the JSF or APS documentation) and experience how the sessions feature can add an extra touch to your app when the same person run it in multiple browser windows or tabs.

This demo also make use of powerful serverside scripts and functions to achieve complex tasks using only Javascript. For example, one of the serverside custom command written in javascript save the canvas raw image Base64 encoded string to a **file** *and* in a **MySQL database**. While saving this image string in a database isn't efficient in a real life scenario, it still shows how APE's features can be helpful when developping your app.

The MySQL support feature is even more important when you think how APE can eleminate the need for all connected users to query the server **at the same time** when new data is available by simply quering the databse once and share the results with every clients. While traditionnal code would required you to query the database everytime a page is loaded to fetch the data (using PHP or another server language), APE can load this data from the database once, cache it and serve it to every client asking for it in a **blazing fast response time**. All of this while notifying connected clients in realtime when new data is available (Isn't that great?).

## Requirements
The *save image to file* feature of this demos requires **APE Server 1.1.3** or newer as it uses the ``os.system`` server function introduced in this version. *MySQL support* is fully supported since version **1.1.2**.


## Going further
The overall source code of this demo is pretty well documented and you should be able to learn a lot from this demo. For any questions, feel free to join the APE Community on the [APE Project Google Group](https://groups.google.com/forum/#!forum/ape-project).
