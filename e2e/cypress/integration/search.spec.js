describe("Search flow", () => {
    it("shows up on the homepage", () => {
        cy.visit("/");
        cy.findByPlaceholderText("Search Regulations")
        .should("be.visible")
        .type("State");
        cy.get(".search-header .search-box").submit();

        cy.url().should("include", "/search/?q=State");
    });
    
    it("displays results of the search", () => {
        cy.visit("/search/?q=State", { timeout: 60000 });
        cy.findByText(/\d+ results, displayed by relevance/).should("be.visible");
        cy.findByRole("link", {name: "§ 431.958 Definitions and use of terms."}).should("be.visible").and('have.attr', 'href');
        cy.findByRole("link", {name: "§ 431.958 Definitions and use of terms."}).click({force: true});
        cy.url().should("include", "/431/Subpart-Q/2020-06-30/#431-958");
    });

    it("links to a search in the eCFR", () => {
        cy.visit("/search/?q=State", { timeout: 60000 });
        cy.findByRole("link", {name: "State in Beta eCFR", exact: false}).should("have.attr", "href", "https://ecfr.federalregister.gov/search?search%5Bdate%5D=current&search%5Bhierarchy%5D%5Btitle%5D=42&search%5Bquery%5D=State&view=standard");
    });

    it("checks a11y for search page", () => {
        cy.visit("/search/?q=State", { timeout: 60000 });
        cy.injectAxe();
        cy.checkAccessibility();
    });
    
    it("should have a working searchbox", () => {
        cy.visit("/search/?q=State", { timeout: 60000 });
        cy.scrollTo("top");
        cy.get(".search-reset").click({force: true});
        cy.findByRole("textbox")
          .should("be.visible")
          .type("test", {force: true});
        cy.get("main .search-box").submit();
        cy.url().should("include", "/search/?q=test");
    });

    it("should be able to clear the searchbox", () => {
        cy.visit("/search/?q=State", { timeout: 60000 });
        cy.scrollTo("top");
        
        cy.get(".search-reset").click({force: true});

        cy.findByRole("textbox")
          .should("be.visible")
          .type("test", {force: true});
        
        cy.findByDisplayValue("test")
          .should("be.visible")
          .should("have.value", "test");

        cy.get(".search-reset").click({force: true});
        
        cy.findByRole("textbox")
          .should("have.value", "");
    });
});
