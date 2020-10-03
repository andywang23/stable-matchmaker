# Stable Matchmaker

Create stable pairings based on either the Stable Roommate (Irving) or Stable Marriage (Gale-Shapley) Algorithms. Use to create optimal working groups based on order-ranked sets of preferences submitted by users. 

**Stable Marriage** solves for matches between two distinct groups of individuals, i.e. people in the same group cannot match with each other. Real world use case: matching incoming residents/medical students to hospitals. **Proven to always create stable matches.**

**Stable Roomates** solves for matches within a single group of individuals. **WILL NOT ALWAYS LEAD TO STABLE MATCHES** especially when the sample size grows. I have implemented a workaround to solve for "semi-stable" matches - the underlying logic being that most people will have strong opinions about their most and least favored preferences but will be largely ambivalent about folks they place in the middle. My "force-match" algorithm will randomly swap pairs of middle preferences for a random person (leaving the most and least preferred folks untouched) and will attempt to solve for a stable solution on each swap. 

## App Functionality

Before creating a group to match, administrators/matchmakers are required to register an account. Once a group is created, admins are given a uniquely generated invite key to disseminate to their users.

Users can log in with their unique key (no need to register) and input their order-ranked preferences in a drag-and-drop form as demonstrated below.
<img src="https://i.imgur.com/QZOP8Z5.gif"/>



## Test
Tests can be run by executing

```
$ npm run test
```

from the parent folder.
