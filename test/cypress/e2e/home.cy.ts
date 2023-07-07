// Use `cy.dataCy` custom command for more robust tests
// See https://docs.cypress.io/guides/references/best-practices.html#Selecting-Elements

// ** This file is an example of how to write Cypress tests, you can safely delete it **

// This test will pass when run against a clean Quasar project
import { ethers } from 'ethers'

describe('Landing', () => {
  beforeEach(() => {
    cy.viewport('iphone-x')
    cy.visit('/')
  })
  it('should navigate between page', () => {
    // Login
    cy.dataCy('sign_in').click()

    // Click on add team button
    cy.dataCy('add_team').click()

    // Check we are on create team page
    cy.get('input')
    cy.get('.q-toolbar__title').contains('Create New Team')
    cy.get('a.q-btn > .q-btn__content > .q-icon').click()
    cy.get('.q-toolbar__title').contains('Crypto Tips')
  })
  it('Should create Dev Team', () => {
    // Create team
    cy.get('.q-page > div > .q-btn').click()
    cy.get('.q-pa-md > .q-btn').click()
    cy.get('.q-toolbar__title').contains('Create New Team')
    cy.get('.q-field__inner > .q-field__control').eq(0).type('Dev Team')
    cy.get('.q-textarea > .q-field__inner > .q-field__control > .q-field__control-container').type(
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed eget justo tempus, egestas libero vel, pulvinar ' +
        'lacus. Vestibulum non metus tempus, dictum enim at, finibus justo. Interdum et malesuada fames ac ante ipsum primis' +
        ' in faucibus. Aenean sodales consequat ultrices. Duis nec elit ultrices, laoreet nulla vitae, aliquam dolor.'
    )
    const randomWallet = ethers.Wallet.createRandom()
    const randomWallet2 = ethers.Wallet.createRandom()
    cy.get('.q-field__inner > .q-field__control').eq(3).type(randomWallet.address)
    cy.get('.q-field__inner > .q-field__control').eq(2).type(randomWallet2.address)
    cy.get('.q-btn--standard').click()
  })
  it('Test Create Writer team', () => {
    cy.get('.q-pa-md > .q-btn').click()
    cy.get('.q-toolbar__title').contains('Create New Team')

    // Fill Form
    cy.get('.q-field__inner > .q-field__control').eq(0).type('Writer Team')
    cy.get('.q-textarea > .q-field__inner > .q-field__control > .q-field__control-container').type(
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed eget justo tempus, egestas libero vel, pulvinar ' +
        'lacus. Vestibulum non metus tempus, dictum enim at, finibus justo. Interdum et malesuada fames ac ante ipsum primis' +
        ' in faucibus. Aenean sodales consequat ultrices. Duis nec elit ultrices, laoreet nulla vitae, aliquam dolor.'
    )
    let randomWallet = ethers.Wallet.createRandom()
    cy.get('.q-field__before > .text-primary').eq(1).click()
    cy.get('.q-field__inner > .q-field__control').eq(2).type(randomWallet.address)
    randomWallet = ethers.Wallet.createRandom()
    cy.get('.q-field__inner > .q-field__control').eq(3).type(randomWallet.address)
    randomWallet = ethers.Wallet.createRandom()
    cy.get('.q-field__inner > .q-field__control').eq(4).type(randomWallet.address)
    cy.get('.q-btn--standard').click()

    //Check the form is submitted successfully
    cy.get('.q-notification__message').contains('Team successfully Created')

    // Check the redirection
    cy.get('.q-toolbar__title').contains('Crypto Tips')
  })
})

// Workaround for Cypress AE + TS + Vite
// See: https://github.com/quasarframework/quasar-testing/issues/262#issuecomment-1154127497
export {}
