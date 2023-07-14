class Time{
    static get_time(){
        const curr_timezon = Intl.DateTimeFormat().resolvedOptions().timeZone;
        const options = {
            timeZone: curr_timezon,
            year: 'numeric',
            month: 'numeric',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric',
          },
          formatter = new Intl.DateTimeFormat([], options);
        const our_time = formatter.format(new Date());
        return our_time;
    }   
}
export default Time; 