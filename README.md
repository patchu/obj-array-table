# obj-array-table

I wrote this to use in my personal projects. As such, the documentation is a bit sparse.
Look at `test.coffee` for usage examples.

`format` prints out an array of objects in table format. It turns this...

````javascript
  obj = [
    {
      "First Name": 'John',
      "Last Name": 'Smith',
      alive: true,
      "How.Many.Cats.Owned": 2,
      zip: '00000',
      dob: new Date('Tue Apr 2 1946 20:41:37 GMT-0400 (EDT)')
    }, {
      "First Name": 'Buckaroo',
      "Last Name": 'Banzai',
      alive: false,
      "How.Many.Cats.Owned": 1,
      zip: '12345',
      dob: new Date('Tue Dec 25 1957 20:41:37 GMT-0400 (EDT)')
    }
  ];
````

... into this:

````
                                 How
                                 Many
                                 Cats
First Name   Last Name   alive   Owned   zip     dob
----------   ---------   -----   -----   -----   --------------------
John         Smith       true        2   00000   04/02/1946  08:41 pm
Buckaroo     Banzai      false       1   12345   12/25/1957  07:41 pm
  (2 rows returned)
````


`parse` parses a table in the format:

````
|------|-----------|------|
| col1 | strHeader | col3 |
|------|-----------|------|
|    1 | hello     |   22 |
|    2 | world     |    4 |
|------|-----------|------|
````

into an array of objects, with the headers as the properties.

````
[
  {
    col1: '1',
    strHeader: 'hello',
    col3: '22'
  }, {
    col1: '2',
    strHeader: 'world',
    col3: '4'
  }
];
````
