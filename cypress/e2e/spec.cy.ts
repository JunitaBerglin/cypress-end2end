import { IOmdbResponse } from "../../src/ts/models/IOmdbResponse";

beforeEach(() => {
  cy.visit("/");
  // om vi skriver ett slash kommer den automatiskt surfa till vår BAS-url i vår config fil.
});

const mockData: IOmdbResponse = {
  Search: [
    {
      Title: "The menu",
      imdbID: "3456",
      Type: "drama",
      Poster: "urlPic",
      Year: "1934",
    },
    {
      Title: "Black Panther",
      imdbID: "34555",
      Type: "drama",
      Poster: "urlPic2",
      Year: "1933",
    },
    {
      Title: "Andor",
      imdbID: "34555",
      Type: "drama",
      Poster: "urlPic2",
      Year: "1933",
    },
    {
      Title: "Harry Potter",
      imdbID: "34555",
      Type: "drama",
      Poster: "urlPic2",
      Year: "1933",
    },
    {
      Title: "Harry Potter",
      imdbID: "34555",
      Type: "drama",
      Poster: "urlPic2",
      Year: "1933",
    },
  ],
};

describe("should test movieApp", () => {
  it("should check if there is an input", () => {
    // arrange

    // assert         // act:
    cy.get("input#searchText");
  });

  it("should be able to type", () => {
    // arrange

    // assert         // act:
    cy.get("input").type("Harry");
  });

  // movieApp - real calls to API
  it("should be able to click", () => {
    cy.get("input").type("Star Wars");
    cy.get("#search").click(); // här görs ett riktigt anrop
    cy.get("#movie-container>div").should("have.length", 10);
  });

  it("should display error message if input is >3 characters", () => {
    cy.get("input").clear(); //rensa inputfältet
    cy.get("input").type("St");
    cy.get("button").click();
    cy.get("p").should("contain", "Inga sökresultat att visa");
  });

  it("should display error message if there is no input", () => {
    cy.get("input").clear(); //rensa inputfältet
    cy.get("button").click();
    cy.get("input").should("have.value", "");
    cy.get("p").should("contain", "Inga sökresultat att visa");
  });

  it("should display error message if input that doesnt exist in the list", () => {
    cy.get("input").clear(); //rensa inputfältet
    cy.get("input").type("fkhgb");
    cy.get("input").should("have.value", "fkhgb");
    cy.get("button").click();
    cy.get("p").should("contain", "Inga sökresultat att visa");
  });

  it("should display empty list when user writes wrong thing", () => {
    cy.get("input").clear(); //rensa inputfältet
    cy.get("input").type("film som inte finns");
    cy.get("input").should("have.value", "film som inte finns");
    cy.get("button").click();
    cy.get("p").should("have.length", 0);
  });
});

describe("movieApp - MOCK calls to API", () => {
  it("should get mock data", () => {
    cy.intercept("GET", "http://omdbapi.com/* ", mockData).as(
      "mockedList"
    );
    cy.get("input").type("Star Wars");
    cy.get("#search").click();
    cy.get("h3").should("have.length", 5);
    cy.wait("@mockedList")
      .its("request.url")
      .should("contain", "Star%20Wars");

    cy.get("h3:last").contains("Harry Potter");
  });
});
