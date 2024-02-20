const now = () => {
    return utc_to_local(new Date());
}

const parseDate = (date) => {
    data = {
        year: date.slice(0, 4),
        month: date.slice(5, 7),
        date: date.slice(8, 10)
    }
    return utc_to_local(new Date(data.year, data.month-1, data.date));
}

const parseTime = (time) => {
    data = {
        hour: time.slice(0, 2),
        minute: time.slice(2, 4)
    }
    return utc_to_local(new Date(0, 0, 0, data.hour, data.minute, 0, 0));
}

const parseDateTime = (date, time) => {
    data = {
        year: date.slice(0, 4),
        month: date.slice(5, 7),
        date: date.slice(8, 10),
        hour: time.slice(0, 2),
        minute: time.slice(2, 4)
    }
    return utc_to_local(new Date(data.year, data.month-1, data.date, data.hour, data.minute, 0, 0));
}

const utc_to_local = (date) => {
    const offset = new Date().getTimezoneOffset() * 60000;
    if (offset > 0){
        return new Date(date.valueOf() + offset);
    }
    else{
        return new Date(date.valueOf() - offset);
    }
}

module.exports = {
    now,
    parseDate,
    parseTime,
    parseDateTime
}
