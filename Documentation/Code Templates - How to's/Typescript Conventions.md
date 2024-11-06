# Typescript Conventions

## Differences between Typescript and Javascript

/* Javascript Example */
```
let total = 0;
function IncrementTotal() {
	total += 1;
}
```

/* Typescript Example */
```
let total: number = 0;
function IncrementTotal(): void {
	total += 1;
}
```


## Naming for functions that make requests to the server

Functions should be prefixed with "ServerRequest_" 
e.g.

```
private ServerRequest_GetStoryModule(): void {

}
```


## Casing

- Variables should use camelCase.
- Functions should use PascalCase.
- Private variables that are readonly (value will never change) should be prefixed with "_".