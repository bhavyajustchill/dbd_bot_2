if npm install fails with gyp error,

Make sure you have:

1. Visual Studio with Desktop Development with C++ module
2. Python 3

Ensure Python has these installed

```
python -m ensurepip --upgrade
python -m pip install setuptools
python.exe -m pip install --upgrade pip
```

Update these global packages in npm

```
npm install -g npm@latest
npm install -g node-gyp@latest
```
