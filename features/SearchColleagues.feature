Feature: Search Colleagues
  As an employee,
  I want to search for a colleague by name or job title with filters,
  so that I can quickly find the right person and open their public profile.

  Background:
    Given I am logged in as an Employee and on the "Home" page
    When I click on the "Search colleagues" button
    Then I should see the "Search colleagues" page

  @automated @smoke 
  Scenario: Search colleagues by partial name and submit with Search button
    When I enter a partial name "mAr" in the "nameOrRole" field
    And I click the "Search" button
    Then colleague cards should contain "mAr" 
    And the colleague counter above should reflect the current results

   @automated @smoke 
  Scenario: Search colleagues by partial job title and submit with Search button
    When I enter "tEs" in the "nameOrRole" field
    And I click the "Search" button
    Then colleague cards should contain "tEs" 
    And the colleague counter above should reflect the current results

  @automated @regression 
  Scenario: Combine text search with Job title filter and reset filters
    When I enter "Bari" in the "nameOrRole" field
    And I select a "jobTitle" from the filter dropdown
    And select a "Demo Tech | QA Automation Engineer" from the filter dropdown
    And I click the "Search" button
    Then colleague cards name should be displayed with "Bari Qapbash"
    When I click "Reset filters"
    Then the search input and active filters should be cleared
    And the colleague counter above should reflect the current results


  @automated @regression 
  Scenario: Display "No results" when no colleague matches the criteria
    When I enter "@#--##" in the "nameOrRole" field
    And I click the "Search" button
    Then I should see "No results"
    And the colleague counter above should reflect the current results


  @automated @smoke 
  Scenario: Open a colleague public profile from a result card
    When I enter "Bari Qapbash" in the "nameOrRole" field
    And I click the "Search" button
    And I click on the colleagueCard
    Then I should see Organizzation Unit should be "Demo Tech Validation Unit"
    Then I should see Job Title should be "Demo Tech | QA Automation Engineer"
    Then I should see Seniority level should be "Specialist"
    Then I should see Geography should be "Italy"

  @manual @regression 
  Scenario: Search is case-insensitive and can be triggered with Enter key
    When I enter a colleague name or role using mixed casing in the "nameOrRole" field
    And I press the Enter key
    Then matching colleague cards should be displayed regardless of letter casing

  @manual @regression 
  Scenario: Sort colleague results A-Z and Z-A
    When I select sort order "A-Z"
    Then the displayed colleague cards should be ordered alphabetically from A to Z
    When I select sort order "Z-A"
    Then the displayed colleague cards should be ordered alphabetically from Z to A

  @manual @regression 
  Scenario: Paginate colleague results in pages of up to 12 items
    Given there are more than 12 matching colleagues in the directory
    Then the first page should display at most 12 colleague cards
    When I navigate to the next page
    Then subsequent colleague cards should be displayed

  @manual @boundary 
  Scenario: Current logged-in user is marked with the "You" badge in results
    When I search for my own name
    Then my colleague card should display the "Your Profile" label