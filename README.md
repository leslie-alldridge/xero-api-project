# Duplicate Invoice Summarising Tool for Xero Accounting Software

This app is built to help users who have created multi invoices for a customer on the same day, quickly total and create new "daily summary" invoices. 

### My Dream 

After informing many users that their invoicing habits are the reason for performance issues in Xero, I thought to myself there must be a better way. A tool that could squash duplicate invoices into a single invoice for the contact, is ideal. That way we could tell users that we understand this will take a bit of time but it's possible to quickly: 

   | Action in App
---| -------------
1.  | Create daily summary invoices with this app.
2.  | Pop into Xero and void/remove singular invoices (INV numbers available in this app to make this easier)
3.  | Use Find and Match to quickly reconcile with the new daily summary invoice. For example, two $100 invoces with payments       will match to one $200 invoice.

### Guidelines

The user can retrieve all their invoices from Xero (filter the list if preferred) and click the check for duplicates link. They'll see a page with all duplicates listed by contact and nested by date. 

By pressing create, a new window will display with information pre-populated to assist with invoice creation. Saving the invoice will create a new draft invoice in their Xero organisation.


## Todo List

### MVP: Achieved

Provide the ability to locate duplicate invoices for a customer, based on the invoice date.

Allow the user to quickly create and post a summarized invoice to Xero.

Goal: Enable users to easily identify where duplicates arise, remedy the problem and reduce overall invoicing volume. This will help them stay within our recommended limits and enjoy a rich experience on the Xero platform.

### Stretch: In progress

Find duplicates for multiple customers: Done

Add filter to view page to condense info: Done

Add paging/a limit to reduce API call size:

Add a 'more details' option to allow users to customize their invoices further: Done

Pull the date through on the form instead of using the default of today's date: Done

Set up cookies for a nicer experience: 

Display granular invoice detail in stealth tab: In progress - detail shows but isn't toggled yet

CSS and styling to provide a sleek experience: Done

Updated dependencies to latest: In progress

### Running the Sample App

```
yarn 
yarn start
```
You should now see `listening on http://localhost:3100`.  Browse there and reduce some duplicates!
