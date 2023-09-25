import React, {useState, useEffect} from "react"
import classes from "./WeatherDetails.module.css"
// import Box from "@mui/material/Box"
import Card from "@mui/material/Card"
import CardContent from "@mui/material/CardContent"
import Typography from "@mui/material/Typography"

import IconButton from "@mui/material/IconButton"
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder"
import FavoriteIcon from "@mui/icons-material/Favorite"
import Stack from "@mui/material/Stack"

// const bull = (
//   <Box
//     component="span"
//     sx={{display: "inline-block", mx: "2px", transform: "scale(0.8)"}}
//   >
//     •
//   </Box>
// )

interface CurrentWeatherConditions {
  WeatherText: string
  Temperature: {
    Metric: {
      Value: number
      Unit: string
    }
    Imperial: {
      Value: number
      Unit: string
    }
  }
}

interface WeatherDetailsProps {
  selectedCityKey: string
}

interface DailyForecast {
  Date: string
  Temperature: {
    Minimum: {
      Value: number
      Unit: string
    }
    Maximum: {
      Value: number
      Unit: string
    }
  }
}

interface DailyForecastsResponse {
  DailyForecasts: DailyForecast[]
}

const apiKey = "eRNLNGG3oeGxTSnzYHanKaG1SVSwOqvU"
const END_POINT = "http://dataservice.accuweather.com/currentconditions/v1/"

const END_POINT_5 =
  "http://dataservice.accuweather.com/forecasts/v1/daily/5day/"

const WeatherDetails = (props: WeatherDetailsProps) => {
  const [currentConditions, setCurrentConditions] =
    useState<CurrentWeatherConditions | null>(null)

  const [dailyForecasts, setDailyForecasts] = useState<DailyForecast[]>([])

  const [favorite, setFavorite] = useState(false)

  // would like to check if foundLocation is already added to favorites > show full heart on details in HomePage
  // const [isFavorite, setIsFavorite] = useState(false)

  useEffect(() => {
    console.log("REMOVE THE RETURN")
    return
    fetch(`${END_POINT_5}/${props.selectedCityKey}?apikey=${apiKey}`)
      .then((response) => {
        return response.json()
      })
      .then((data: DailyForecastsResponse) => {
        setDailyForecasts(data.DailyForecasts)
      })
      .catch((error) => console.error("Error fetching daily forecasts:", error))
  }, [props.selectedCityKey])

  useEffect(() => {
    console.log("REMOVE THE RETURN")
    return
    fetch(`${END_POINT}/${props.selectedCityKey}?apikey=${apiKey}`)
      .then((response) => {
        return response.json()
      })
      .then((data) => {
        const foundWeatherConditions = data[0]
        setCurrentConditions(foundWeatherConditions)
      })
      .catch((error) =>
        console.error("Error fetching weather conditions:", error)
      )
  }, [props.selectedCityKey])

  const getDayOfWeek = (dateString: string) => {
    const date = new Date(dateString)
    const options = {weekday: "long"}
    return new Intl.DateTimeFormat("en-US", options).format(date)
    //fix typescript
  }

  const favoriteHandler = (event: any) => {
    event.preventDefault()
    console.log(event)
    setFavorite(!favorite)
    const favorites = JSON.parse(localStorage.getItem("Favorites"))

    const isLocationFavorite = favorites.some(
      (fav) => fav.ID === props.selectedCityKey
    )
    if (isLocationFavorite) {
      // Remove from favorites
      const updatedFavorites = favorites.filter(
        (fav) => fav.ID !== props.selectedCityKey
      )
      localStorage.setItem("Favorites", JSON.stringify(updatedFavorites))
    } else {
      // Add to favorites
      const newFavorite = {
        ID: props.selectedCityKey,
        name: props.locationName,
        // TODO: should be loaded in favorites page
        currentWeather: currentConditions.WeatherText
      }
      const updatedFavorites = [newFavorite, ...favorites]
      localStorage.setItem("Favorites", JSON.stringify(updatedFavorites))
    }
    setFavorite(!isLocationFavorite) // Toggle favorite state
  }

  return (
    <>
      {/* TODO: move inside : <div className={classes.weatherCurrentConditions}></div> */}
      <Stack direction="row" spacing={1}>
        <IconButton aria-label="favorite" onClick={favoriteHandler}>
          {favorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
        </IconButton>
      </Stack>
      {currentConditions && (
        <div className={classes.weatherCurrentConditions}>
          {/* <Stack direction="row" spacing={1}>
            <IconButton aria-label="favorite" onClick={favoriteHandler}>
              {favorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
            </IconButton>
          </Stack> */}

          {/* <div>Weather details for: {props.locationName} </div> */}

          <div>{currentConditions.WeatherText}</div>
          <div>
            {currentConditions.Temperature.Metric.Value}{" "}
            {currentConditions.Temperature.Metric.Unit}
          </div>
          {/* <div>
                {currentConditions.Temperature.Imperial.Value}{" "}
                {currentConditions.Temperature.Imperial.Unit}
              </div> */}
        </div>
      )}

      <div className={classes.dailyFiveForecasts}>
        {dailyForecasts.length > 0 ? (
          dailyForecasts.map((forecast, index) => (
            <Card sx={{minWidth: 275}} key={index}>
              <div className={classes.daily}>
                <CardContent>
                  <Typography
                    component="span"
                    sx={{fontSize: 14}}
                    color="text.secondary"
                    gutterBottom
                  >
                    <div>{getDayOfWeek(forecast.Date)}</div>
                  </Typography>
                  <Typography
                    component="span"
                    sx={{mb: 1.5}}
                    color="text.secondary"
                  >
                    <div>
                      {forecast.Temperature.Maximum.Value}{" "}
                      {forecast.Temperature.Maximum.Unit}
                    </div>
                  </Typography>
                </CardContent>
              </div>
            </Card>
          ))
        ) : (
          <p>Loading daily forecasts...</p>
        )}
      </div>
    </>
  )
}

export default WeatherDetails
