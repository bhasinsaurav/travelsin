const searchbtn = document.getElementById('searchBtn');
let recommendations = [];

function findRecommendation() {
    let keyword = document.getElementById("searchInput").value.toLowerCase();
    
    fetch('./travel_recommendation_api.json')
        .then(response => response.json())
        .then(data => {
            console.log(data);
            
            // 1. Check for Beaches (Fixed variable reference error)
            if (keyword === 'beach' || keyword === 'beaches') {
                recommendations = data.beaches; 
                return showRecommendation();
            } 
            
            // 2. Check for Temples (Fixed variable reference error)
            else if (keyword === 'temple' || keyword === 'temples') {
                recommendations = data.temples;
                return showRecommendation();
            } 
            
            // 3. Check for the general "Countries" keyword
            else if (keyword === 'country' || keyword === 'countries') {
                recommendations = []; // Reset array
                data.countries.forEach(country => {
                    recommendations = recommendations.concat(country.cities);
                });
                return showRecommendation();
            }
            
            // 4. Search for a SPECIFIC country name
            else {
                const matchedCountry = data.countries.find(country => 
                    country.name.toLowerCase() === keyword
                );

                if (matchedCountry) {
                    console.log(`Found specific country: ${matchedCountry.name}`);
                    recommendations = matchedCountry.cities;
                    return showRecommendation();
                } else {
                    console.log("Sorry, no recommendations found for that keyword.");
                }
            }
        })
        .catch(error => console.error('Error fetching data:', error));
}

searchbtn.addEventListener('click', findRecommendation);

function showRecommendation() {
    const mainContent = document.querySelector('.main-content');
    const homeSection = document.querySelector('.home-section');
    
    // Fix #1: Hide the home section correctly
    if(homeSection) {
        homeSection.style.display = 'none'; 
    }

    // Clear previous search results so they don't stack up
    mainContent.innerHTML = ''; 

    // Create a container for the new recommendations
    let recommendationDiv = document.createElement('div');
    recommendationDiv.classList.add('recommendation-container');
    recommendationDiv.style.display = 'flex';
    recommendationDiv.style.backgroundColor = 'white';

    // Fix #2: Create elements INSIDE the loop
    recommendations.forEach((item) => {
        let elementDiv = document.createElement('div');
        elementDiv.classList.add('recommendation-card'); // Helpful for CSS styling
        
        let heading = document.createElement('h2');
        heading.style.textDecorationColor = 'black'
        let image = document.createElement('img');
        let description = document.createElement('p');
        description.style.textColor = 'black'

        heading.textContent = item.name;
        image.src = item.imageUrl;
        description.innerText = item.description;

        elementDiv.appendChild(heading);
        elementDiv.appendChild(image);
        elementDiv.appendChild(description);
        
        recommendationDiv.appendChild(elementDiv);
    });

    // Finally, append the whole container to the main content
    mainContent.appendChild(recommendationDiv);
}