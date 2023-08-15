describe("Note app", function () {
  beforeEach(function () {
    cy.request("POST", `${Cypress.env("BACKEND")}/testing/reset`);
    const user = {
      name: "Ariful Islam",
      username: "ariful",
      password: "secret",
    };

    cy.request("POST", `${Cypress.env("BACKEND")}/users`, user);
    cy.visit("");
  });

  it.only("front page can be opened", function () {
    cy.contains("Notes");
    cy.contains(
      "Note app, Department of Computer Science, University of Helsinki 2023"
    );
  });

  it("user can log in", function () {
    cy.contains("log in").click();
    cy.get("#username").type("ariful");
    cy.get("#password").type("secret");
    cy.get("#login-button").click();

    cy.contains("Ariful Islam logged in");
  });

  describe("when logged in", function () {
    beforeEach(function () {
      cy.login({ username: "ariful", password: "secret" });
    });

    describe("and several notes exist", function () {
      beforeEach(function () {
        cy.createNote({ content: "first note", important: false });
        cy.createNote({ content: "second note", important: false });
        cy.createNote({ content: "third note", important: false });
      });

      it.only("one of those can be made important", function () {
        cy.contains("second note").parent().find("button").as("theButton");
        cy.get("@theButton").click();
        cy.get("@theButton").should("contain", "make not important");
      });
      it.only("then example", function () {
        cy.get("button").then((buttons) => {
          console.log("number of buttons", buttons.length);
          cy.wrap(buttons[0]).click();
        });
      });
    });

    it("a new note can be created", function () {
      cy.contains("new note").click();
      cy.get("input").type("a note created by cypress");
      cy.contains("save").click();

      cy.contains("a note created by cypress");
    });

    describe("and a note exists", function () {
      beforeEach(function () {
        cy.createNote({
          content: "another note cypress",
          important: true,
        });
      });

      it("it can be made not important", function () {
        cy.contains("another note cypress")
          .contains("make not important")
          .click();

        cy.contains("another note cypress").contains("make important");
      });
    });
  });

  it("login fails with wrong password", function () {
    cy.contains("log in").click();
    cy.get("#username").type("ariful");
    cy.get("#password").type("wrong");
    cy.get("#login-button").click();

    cy.get(".error")
      .should("contain", "Wrong credential")
      .and("have.css", "color", "rgb(255, 0, 0)")
      .and("have.css", "border-style", "solid");

    cy.contains("Ariful Islam logged in").should("not.exist");
  });
});
