# Flipper example

A simple Flipper contract holding a boolean value, which can be flipped.

The following calls should be called from the root folder.

## Deploy

Call
```
npx hardhat run scripts/flipper/deploy.js 
```


## Flip the value
Copy the deploy address from the above call and put it into		`flipperAddress` in `scripts/flipper/flip.js` file.

Then run:
```
npx hardhat run scripts/flipper/flip.js 
```

The value should be flipped.
