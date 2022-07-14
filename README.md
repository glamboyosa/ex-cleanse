# ex-cleanse

A utility that cleans up logs in your Elixir application by [glamboyosa](https://github.com/glamboyosa)

Available as a [VS Code extension](https://marketplace.visualstudio.com/items?itemName=glamboyosa.ex-cleanse)

https://user-images.githubusercontent.com/42815369/172269613-99098670-cd6b-45e2-8c74-4a0e04d61c83.mov

## Features

This extension has two main features:

- The `Add Logger` feature which allows you to add a new logger function or command e.g. `IO.puts` to a global list of loggers.
- The `Cleanse` feature which allows you to remove logs in your application.

## Usage

### Add Logger

To use the `Add Logger` feature simply open up your command palette and type `Add Logger`.
It'll display a text input for you to enter the name of the logger function or command you want to add.

### Cleanse

There are two ways to use the `Cleanse` feature.

- Via keyboard binding: Type the command

```bash
ctrl + shift + a
# or on Mac
⌘ + ⇧ + a

```

- Via the command palette: Open up the command palette and type `Cleanse`.

## Release Notes

### 1.0.0

Initial release of `ex-cleanse`.

### 1.0.1

Internal function definiton changes.

### 1.0.2

Improved grammatical accuracy of error message when log deleted is one.

### 1.0.3

Fixed regex definition in default case.
