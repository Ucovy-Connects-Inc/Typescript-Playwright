@component
Feature: Header component coverage
  As a shopper
  I want core header interactions to remain stable
  So that reusable UI components can be validated inside the unified BDD suite

  Scenario: Navigate to login from the account menu
    Given the user opens the store home page
    When the user opens the account menu
    And the user chooses the login option
    Then the login page is displayed

  Scenario: Search for a product from the header
    Given the user opens the store home page
    When the user searches for "MacBook" from the header
    Then search results for "MacBook" are shown
