const latInp = document.querySelector("#latitude")
const lonInp = document.querySelector("#longitude")
const airQuality = document.querySelector(".air-quality")
const airQualityStat = document.querySelector(".air-quality-status")
const srchBtn = document.querySelector(".search-btn")
const errorLabel = document.querySelector("label[for='error-msg']")
const componentsEle = document.querySelectorAll(".component-val")

const appId= "52aaa4db109a008e9fe5ff0a93ad9fff"
const link = "https://api.openweathermap.org/data/2.5/air_pollution"
const getUserLocation = () =>{
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(onPositionGathered, onPositionGatherError)

    }else{
        onPositionGatherError({ message : "Can't access Location. Enter coordinates"})

    }
}

const onPositionGathered = pos => {
    let lat = pos.coords.latitude.toFixed(4),
    lon = pos.coords.longitude.toFixed(4)

    latInp.value = lat
    lonInp.value = lon

    getAirQuality(lat, lon)
}

const getAirQuality = async (lat, lon) => {
    const rawData = await fetch(`${link}?lat=${lat}&lon=${lon}&appId=${appId}`).catch(err =>
        {onPositionGatherError(err)})
    const airData = await rawData.json()

    console.log(airData)

    setValuesOfAir(airData)
    setComponentsOfAir(airData)
}

const setValuesOfAir = airData => {
    const aqi = airData.list[0].main.aqi
    let airStat = "" , color = ""

    airQuality.innerText = aqi

    switch(aqi){
        case 1:
            airStat = "Good"
            color = "rgb(19, 201, 28)"
            break
        case 2:
            airStat = "Fair"
            color = "rgb(15, 134, 25)"    
            break
        case 3:
            airStat = "Moderate"   
            color = "rgb(201, 204, 13)" 
            break
        case 4:
            airStat = "Poor"
            color = "rgb(204, 83, 13)" 
            break
        case 5:
            airStat = "Very poor"
            color = "rgb(204, 13, 13)"  
            break
        default:
            airStat = "Unknown"        
    }
    airQualityStat.innerText = airStat
    airQualityStat.style.color = color
}

const setComponentsOfAir = airData => {
    let component = {...airData.list[0].components}
    componentsEle.forEach(ele => {
        const attr = ele.getAttribute('data-comp')
        ele.innerText = component[attr] += 'μg/mᶟ'
    })
}

const onPositionGatherError = e => {
    errorLabel.innerText = e.message
}

srchBtn.addEventListener("click", ()=> {
    let lat = parseFloat(latInp.value).toFixed(4)
    let lon = parseFloat(lonInp.value).toFixed(4)
    getAirQuality(lat, lon)
})


getUserLocation()
