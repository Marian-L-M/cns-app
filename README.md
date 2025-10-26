# Clouds and Spaceships Project (CNS)

Clouds and Spaceships is an interactive wiki system focused on connecting maps to information. The system is mainly targeted towards authors that want to visualize their creations and stories.

At the core of the system lies the ability to make existing map images interactive.

As a general direction, CNS tries to be unbiased in its design and putting own your data first, which is especially a sensitive issue for authors who do not want to entrust their lifework to services that require monthly subscriptions or may shut down at moments notice. This is not to say that such services should not be and are not employed, however the CNS project aims to give authors the agency to gather their data and move on to other platforms.

# Specifications

The system is built using Next.JS (Typescript), PostgreSQL, and Prisma. The mapping tool uses raw HTML Canvas functionality.

The following services used as of September 2025:

- [NextAuth.js](https://next-auth.js.org/) (Authentication)
- [Uploadthing](https://uploadthing.com/) (Image upload)
- [Vercel](https://vercel.com/) (Demo)

# Installation (demo)

Production logic is not yet implemented

```
DATABASE_URL="****DEMO-DB-URL"
NEXT_PUBLIC_APP_NAME = "APP DISPLAY NAME"
NEXT_PUBLIC_APP_DESCRIPTION = "APP CATCHPHRASE"
NEXT_PUBLIC_SERVER_URL = "APP SERVER URL"

NEXTAUTH_SECRET = "NEXT AUTH TOKEN"
NEXTAUTH_URL="APP SERVER URL"
NEXTAUTH_URL_INTERNAL="APP SERVER URL"

UPLOADTHING_TOKEN='UPLOADTHING TOKEN'
UPLOADTHING_SECRET='UPLOADTHING SECRET'
UPLOADTHING_ID='UPLOADTHING ID'
```

On local set your APP SERVER URL to http://localhost:XXXX, else to whatever your actual server url is. If you are using vercel, the routing logic should be handle via their inbuild environment variable system.

## Configuration

Set host for image upload and other cdns.

### For local development

1. Set up a Postgres server using Docker
2. Move to the cns-app root folder and Install using the standard npm build routine
3. Create a .env file in the root folder

In the long run setting up an npm package is planned. In the very long run a full installation package should enable non technical people to set up their own instance.

# Release History

- 0.0.1 2025.09.26 - Trial demo release

# Known Bugs and Issues

## Major

1. Object editor items broken
1. Clean up inconsitent and inaccurate naming practices
1. Mastermap childmap submission breaks on the second childmap
1. Invalid form error messages are not set up properly
1. Hierarchy typings are fubar. Need to be burned and rebuild. Mastermaps treats childmaps as maps. Childmap treats individual childmaps like extended hierarchychild with map attached.
1. General performance concerns, improve caching and reduce db requests
1. Multiple substory routes in the same story will trigger at the same time. (Make it a feature instead of a bug)
1. Activate mail confirmation logic and enable system messages
1. Author specific prefiltering for editor pages
1. Editor story voerview filters out completed stories by defualt

## Minor

1. Inconsistent redirection and toaster upon data submission
1. Searchbox prefilter for performance issues
1. Mastermap editor frame repositioning blasts rerendering logic
1. Improve map interactiveness (e.g. cursor on clickable events)
1. Image alt properties
1. Admin reroutes to personal profile after editing user profile

# Roadmap for further development

1. Implementing a medialibrary for deletion✅, reusing✅, and management✅ of image assets. Also the ability to toggle image upload services.
   1. Improve medialibrary QOL: Search, Pagination
1. An in-system data export functionality
1. NPM package
1. Breadcrumbs
1. Clean up and refactoring, as their are a lot of duplicated structures and functions
1. Unify api route writing patterns
1. Collaborative writing functionality (Currently only original author is selected. Needs functionality to share and edit as an extra author)
1. UI Design
1. Improve handling of overlapping areas/object and stories -> Stories should trigger first
1. Add meta data and prerendering to all pages.
1. Create a proper object structure for cw/ch/aspect ratio
1. Initialization script and screens
1. Version and update management
1. Dictionaries and Dramatis Personae
1. System message/news banner (floating not blocked)
1. Storytime system and ordering. Converting storyime into a formatted custom time system
1. User comments and forums
1. Create proper Admin dashboard
1. Multi map stories
1. toggle hide object, area, stories on map
1. Nested Mastermaps
1. Add Authorbox to all content types

# Under consideration

1. Rebuild the system in php & msyql for easier deployment on share server, enabling a larger audience of less technical people to access the system.
1. Api protection -> Best practice unclear

1. Childmap submissions: filter out parent map and already selected
1. Admin page settings - submitting id items with the same setting leads to error
1. Adding a second childmap to mastermap does not work (prefills with first childmap)
1. Wiki submission does not redirect
1. Icons upload does not work like this -> Make static for now
1. Creating a progressive web app
1. Cookies & GDPR
