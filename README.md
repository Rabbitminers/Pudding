<p align="center">
<img style="width: 12em;" src="assets/logo.png" alt="dog"/>
<h1 align="center"> Pudding </h1>
</p>

A simple mobile app for reading and managing ebooks. With full support for ePub files on both Android and *iOS

Note: although pudding should build to and function on iOS devices it has not been tested on these devices.

## Why?

There are plenty of ebook readers available, why make another. Mostly for more simplicity, a simpler more friendly UI and all the features I personally was looking for while having no ads.

---

![Phones](./display/phones.png)

## Building from source

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

## Tech Stack

Pudding is built with SvelteKit as a Capacitor app targetting both iOS and Android. 

## License

Pudding is open source and licensed under the GNU GPLv3 licnse, you can find a copy of the license [here](./LICENSE) for more information.