# Internet Noise Maker

Ever wanted some friends over to help surf the web and fill up your Internet Service Provider's surveillance log of your web traffic? I can _absolutely_ be your friend, but I won't be able to come over.

This is a Dockerized (oops containerized) version of the [Internet Noise](http://makeinternetnoise.com/) site by [Dan Schultz](https://twitter.com/slifty).  I heard about the project from The_HatedOne's [YouTube channel](https://www.youtube.com/channel/UCjr2bPAyPV7t35MvcgT3W8Q)

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequisites

You'll need:
- an always-on server (because who doesn't run their own server)
- Docker or your favorite container engine running
- a bit of understanding about containers

I've hosted the [image on Docker Hub](https://hub.docker.com/r/itsmikechu/internet-noise-maker) for ease of distribution.

### Let's Get Installing

First, pull the image to your server

```
docker pull itsmikechu/internet-noise-maker
```

Then we can spin up a running container using my favorite flags/arguments

```
docker run -d --name="noise" --restart="always" --net="host" --shm-size="1gb" itsmikechu/internet-noise-maker
```

Here's an explaination of the recommended flags:
- `-d` Run the container in the background
- `--name` Choose whatever name you'd like for the running container
- `--restart="always"` We want this running even if it exits unexpectedly or the server is rebooted
- `--net="host"` Use the server's network connection
- `--shm-size` [Puppeteer](https://github.com/GoogleChrome/puppeteer) requires a bit more memory than most containers

## Deployment

Add additional notes about how to deploy this on a live system

## Built With

* [Dropwizard](http://www.dropwizard.io/1.0.2/docs/) - The web framework used
* [Maven](https://maven.apache.org/) - Dependency Management
* [ROME](https://rometools.github.io/rome/) - Used to generate RSS Feeds

## Contributing

Please read [CONTRIBUTING.md](https://gist.github.com/PurpleBooth/b24679402957c63ec426) for details on our code of conduct, and the process for submitting pull requests to us.

## Versioning

We use [SemVer](http://semver.org/) for versioning. For the versions available, see the [tags on this repository](https://github.com/your/project/tags).

## Authors

* **Billie Thompson** - *Initial work* - [PurpleBooth](https://github.com/PurpleBooth)

See also the list of [contributors](https://github.com/your/project/contributors) who participated in this project.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

## Acknowledgments

* Hat tip to anyone whose code was used
* Inspiration
* etc
