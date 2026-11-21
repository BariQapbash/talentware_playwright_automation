# Open Questions

Please confirm the expected behavior for the following cases:

1. **Reset filters**  
   The current assumption is that resetting clears the search and all filters, returns to the unfiltered directory, and returns pagination to the first page. Should it also reset sorting?

2. **Sort order**  
   Should colleagues be sorted by first name, surname, or role? The current behavior appears to sort by surname.

3. **Sorting ties**  
   When colleagues have the same first and last name, should role be used as a tie-breaker? The current behavior does not appear to use one.

4. **Pagination**  
   Should changing filters or sort order return the results to the first page?


