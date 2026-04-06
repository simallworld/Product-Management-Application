# How I Built This Product Management App

Hey! So I was given this assessment to build a full-stack-ish React app with authentication and product management. Here's how I approached it and what I learned along the way.

## The Quick Version

Basically, I had to:
1. Create a React app from scratch
2. Add Redux for state management
3. Build login/register pages
4. Fetch products from an API
5. Implement full CRUD operations

Simple in theory, interesting in practice.

## What I Used

- **React 19** - Just came out, figured why not go with the latest
- **Redux Toolkit** - Makes Redux less painful than it used to be
- **TypeScript** - Saved me from so many bugs. Highly recommend.
- **Tailwind CSS** - No more writing actual CSS, hallelujah
- **Vite** - Lightning fast dev server, amazing DX
- **DummyJSON API** - Free API that actually works great for demos

## The Journey

### Getting Started

I started with Vite because CRA felt slow and outdated. With Vite, the dev server boots in like 50ms. Game changer.

Set up TypeScript right away because I knew the codebase would get complex. Caught so many potential bugs before they even ran.

### Authentication

The trickiest part was handling the DummyJSON API which uses usernames instead of emails. So I basically extract the email username part and pass that. Not perfect, but it works.

Stored the JWT in localStorage initially (not ideal for security, but fine for a demo). The app restores the session on page load, so you don't lose your login after refresh.

### Building the Product Page

This got messy. Started with everything in one giant component - fetching, searching, filtering, creating, editing, deleting... all 500 lines in one file. Nightmare to maintain.

So I broke it down:
- `ProductTable.tsx` - Just renders the table
- `ProductCard.tsx` - Mobile-friendly card view
- `ProductFormModal.tsx` - Handles the form
- `ProductSearchPanel.tsx` - Search and filters

Much better. Each component does one thing.

### Redux State Management

Created slices for auth and products. Async thunks handle all the API calls. Redux automatically handles loading/error states, which is super clean.

The tricky part was setting up pagination AND search at the same time. Had to reset the page number whenever someone searches, which took some debugging.

### The Mobile vs Desktop Problem

Tables don't work on mobile. So I created two different layouts - cards on mobile, table on desktop. Used Tailwind's responsive classes (`md:hidden`, `hidden md:block`) to swap between them. Works pretty well.

## Stuff I Struggled With

**Product Creation Not Sticking Around**

After creating a product, I immediately refetched the whole list. But the new product would disappear from the UI. Turns out DummyJSON doesn't actually save products permanently (it's just a demo API).

Solution: Don't refetch. Just update the Redux state immediately and let the user see it. If they refresh, it's gone, but that's expected with a demo API.

**TypeScript and API Responses**

DummyJSON returns data in a specific format, but my types were different. Had to write transformation functions to map their response to my app's format. Annoying but necessary.

**Description Text Overflow**

Product descriptions are long. Truncating them looked bad. So I added a hover tooltip showing the full description on desktop. For mobile, I just make the description width fixed (100px) so it doesn't look weird.

## What I'm Proud Of

- **Modular components** - Easy to maintain and test
- **Type safety** - TypeScript caught bugs before runtime
- **Responsive design** - Works great on phone and desktop
- **Clean Redux setup** - State management is straightforward
- **Error handling** - API errors show up to the user, not silent failures

## What I'd Do Different

If I had more time:
- Add React Query for better caching and refetching
- Implement proper error boundaries
- Add more form validation
- Write actual unit tests
- Use httpOnly cookies instead of localStorage
- Add loading skeletons instead of just "Loading..."
- Implement actual search instead of just pagination

## Running It

```bash
npm install
npm run dev
```

Login with any username/password (DummyJSON doesn't validate strictly, so `atuny0` / `password` works).

Play around with creating/editing/deleting products. Try searching for stuff. Check it out on your phone too.

## The Real Takeaway

Building this taught me that structure and modularity matter way more than I used to think. Spending an extra hour breaking things into smaller pieces saves so much time later.

Also, TypeScript is genuinely great. I was skeptical at first, but the type safety and IDE autocomplete are worth it.

That's it. Hope you like it! 🚀
