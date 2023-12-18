const Current = require("../Models/Current");
const { validationResult } = require("express-validator");

const createCurrent = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      message: "Invalid inputs passed, please try again",
      errors: errors.array(),
    });
  }
  let date = new Date();
  const formattedDate = date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
  
  const { sensor, energy, voltage } = req.params;
  let addedCurrent = new Current({
    sensor,
    dateandtime: formattedDate,
    energy,
    voltage,
  });
  try {
    await addedCurrent.save();
  } catch (err) {
    const error = new HttpError("Something went wrong, please try again", 500);
    return next(error);
  }
  res.status(201).json({ energy: addedCurrent });
};
const { startOfHour, endOfHour, format } = require('date-fns');

const getDataInMinutes = async (req, res, next) => {
  try {
    const { sensor } = req.params; // Assuming you can get the sensor ID from the request parameters

    // Get the current date and time
    const now = new Date();

    // Set the start time to the beginning of the current hour
    const startTime = startOfHour(now);

    // Set the end time to the end of the current hour
    const endTime = endOfHour(startTime);

    // Format the start and end times in your desired format
    const formattedStartTime = format(startTime, "MMM d, yyyy, hh:mm:ss a");
    

    const formattedEndTime = format(endTime, "MMM d, yyyy, hh:mm:ss a");
    

    // Query the database for records within the specified hour and for the specific sensor ID
    const recordsInHour = await Current.find({
      dateandtime: {
        $gte: formattedStartTime,
        $lt: formattedEndTime,
      },
      sensor: sensor, // Assuming the field name for sensor ID in your database is 'sensor'
    });

    res.json({ records: recordsInHour });
  } catch (err) {
    
    res.status(500).json({ message: 'Something went wrong, please try again' });
  }
};
const getDataInMinutesAllSensors = async (req, res, next) => {
  try {
    // Assuming you can get the sensor ID from the request parameters

    // Get the current date and time
    const now = new Date();

    // Set the start time to the beginning of the current hour
    const startTime = startOfHour(now);

    // Set the end time to the end of the current hour
    const endTime = endOfHour(startTime);

    // Format the start and end times in your desired format
    const formattedStartTime = format(startTime, "MMM d, yyyy, hh:mm:ss a");
    

    const formattedEndTime = format(endTime, "MMM d, yyyy, hh:mm:ss a");
    

    // Query the database for records within the specified hour and for all sensors
    const recordsInHour = await Current.find({
      dateandtime: {
        $gte: formattedStartTime,
        $lt: formattedEndTime,
      },
      // Assuming the field name for sensor ID in your database is 'sensor'
      // If you have a specific sensor ID in req.params, you can add that condition
      // For example: sensor: req.params.sensorId
    });

    res.json({ records: recordsInHour });
  } catch (err) {
    
    res.status(500).json({ message: 'Something went wrong, please try again' });
  }
};








const deleteCurrentByMonth = async (req, res, next) => {
  const { month } = req.params; // Assuming the month is passed as a URL parameter

  try {
    // Create a date for the specified month
    const monthToMatch = new Date(month + " 1, 2023");

    // Calculate the start of the month
    const startOfMonth = new Date(monthToMatch);
    startOfMonth.setUTCHours(0, 0, 0, 0);

    // Calculate the end of the month by setting the month to the next month and then subtracting one millisecond
    const endOfMonth = new Date(monthToMatch);
    endOfMonth.setUTCMonth(endOfMonth.getUTCMonth() + 1);
    endOfMonth.setUTCHours(0, 0, 0, -1);

    // Format the start and end dates in the "MMM DD, YYYY, hh:mm:ss A" format
    const formattedStartOfMonth = startOfMonth.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
    const formattedEndOfMonth = endOfMonth.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });

  
    const recordsInMonth = await Current.find({
        dateandtime: {
          $gte: formattedStartOfMonth,
          $lt: formattedEndOfMonth,
        },
      });
    console.log("Number of records in the specified month: " + recordsInMonth.length);
    // Delete the records if needed
   await Current.deleteMany({
      dateandtime: {
        $gte: formattedStartOfMonth,
        $lt: formattedEndOfMonth,
      },
    });

    res
      .status(200)
      .json({ message: "Data for the specified month has been deleted." });
  } catch (err) {
    const error = new HttpError("Something went wrong, please try again", 500);
    return next(error);
  }
};

exports.createCurrent = createCurrent;
exports.getDataInMinutes=getDataInMinutes
exports.getDataInMinutesAllSensors=getDataInMinutesAllSensors
exports.deleteCurrentByMonth = deleteCurrentByMonth;
