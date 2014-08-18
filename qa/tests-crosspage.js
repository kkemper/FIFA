var Browser = require('zombie'),
	assert = require('chai').assert;
	
var browser;

suite('Cross-Page Tests', function(){
	setup(function() {
		browser = new Browser();
	});
	
	test('submitting a support request from the create a team page should ' + 'populate the hidden referrer field correctly', function(done){
		var referrer = 'http://localhost:3000/team/create'; 
			browser.visit(referrer, function(){
				browser.clickLink('.support', function(){
					assert(browser.field('referrer').value === referrer);
						done();
				});
			});
		});
	
	test('submitting a support request from the edit team page should ' + 'populate the hidden referrer field correctly', function(done){
		var referrer = 'http://localhost:3000/team/edit'; 
			browser.visit(referrer, function(){
				browser.clickLink('.support', function(){
					assert(browser.field('referrer').value === referrer);
						done();
					});
				});
			});
			
			
	test('visiting the "support" page directly should result ' + 'in an empty value for the referrer field', function(done){
		browser.visit('http://localhost:3000/support', function(){
			assert(browser.field('referrer').value === '');
				done();
			});
		});
	});
					
