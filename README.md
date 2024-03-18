<p align="center">
<img style="width: 12em;" src="assets/logo.png" alt="dog"/>
<h1 align="center"> Pudding </h1>
</p>

A simple mobile app for reading and managing ebooks. With full support for ePub files on both Android and *iOS

> [!NOTE] 
> Although pudding should build to and function on iOS devices it has not been tested on these devices.

## Why?

There are plenty of ebook readers available, why make another? Mostly for more simplicity, a simpler more friendly UI and all the features we where personally looking for. (whilst having no adverts)

---

![Phones](./display/phones.png)

## Installation

Pudding is currently in beta, as such it can currently only be installed either from releases here on github or built from source. See instructions for each of these below. Once we reach full releases pudding will be distributed on Google Play and F-Droid with the potential of official iOS releases.

> [!WARNING]
> Pudding is not yet in full release, although the app should be fully functional it has not been extensively tested so you may encounter some bugs, if you do find any please report them.

### From Github Releases (Recommended)

This repository includes prebuilt releases of Pudding for Android see the releases tab (on desktop this on the right hand side, on mobile see the bottom of the page) for a list of available versions.

### Building from source

First obtain the source code from this repository

```bash
git clone https://github.com/rabbitminers/pudding

cd pudding
```

Then install all the dependencies and prepare for a build, we use pnpm here although you can use npm or any other alternative.


```bash
pnpm install
pnpm run build
pnpx cap sync

```

Now you can build Pudding, run the following command and select the platform you are building for.

```bash
pnpm cap build
```

---

![Reading](./display/reading.png)


## Tech Stack

Pudding is built with SvelteKit as a Capacitor app targetting both iOS and Android. 

## License

Pudding is open source and licensed under the GNU GPLv3 license, you can find a copy of the license [here](./LICENSE) for more information.