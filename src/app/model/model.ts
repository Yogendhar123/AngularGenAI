export interface PeriodicElement {
    tasks: string;
    machineid: string;
    parts: string;
    action: string;
    datetime: string;
}

export const ELEMENT_DATA: PeriodicElement[] = [
    { tasks: 'Equipment 1HE0C requires maintenance', machineid: '2', parts: '2', action: 'Observe', datetime: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toLocaleString('en-us', { day: 'numeric', month: 'short', year: 'numeric' }) + ' - 23:05' },
    { tasks: 'Equipment 1HE0C requires maintenance', machineid: '21', parts: '5', action: 'Observe', datetime: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toLocaleString('en-us', { day: 'numeric', month: 'short', year: 'numeric' }) + ' - 22:45' },
    { tasks: 'Expected time to failure of motor is 5 hours', machineid: '4', parts: '2', action: 'Observe', datetime: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toLocaleString('en-us', { day: 'numeric', month: 'short', year: 'numeric' }) + ' - 10:45' },
    { tasks: 'Probability of failure of cutting tool is 90%', machineid: '8', parts: '1', action: 'Replace', datetime: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toLocaleString('en-us', { day: 'numeric', month: 'short', year: 'numeric' }) + ' - 06:35' },
    { tasks: 'Probability of failure of spindle motor is 60%', machineid: '3', parts: '7', action: 'Observe', datetime: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toLocaleString('en-us', { day: 'numeric', month: 'short', year: 'numeric' }) + ' - 11:45' },
    { tasks: 'Vibrations of pump motor outside normal limits', machineid: '6', parts: '3', action: 'Observe', datetime: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toLocaleString('en-us', { day: 'numeric', month: 'short', year: 'numeric' }) + ' - 15:50' },
    { tasks: 'Probability of failure of Milling Tool is 83%', machineid: '5', parts: '6', action: 'Replace', datetime: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toLocaleString('en-us', { day: 'numeric', month: 'short', year: 'numeric' }) + ' - 19:25' },
    { tasks: 'Expected time to failure of motor is 2 hours', machineid: '4', parts: '4', action: 'Observe', datetime: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toLocaleString('en-us', { day: 'numeric', month: 'short', year: 'numeric' }) + ' - 19:30' },
    { tasks: 'Label inspection edge unit overheated', machineid: '15', parts: '9', action: 'Observe', datetime: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toLocaleString('en-us', { day: 'numeric', month: 'short', year: 'numeric' }) + ' - 17:20' },
    { tasks: 'Pump calibration error above 80%', machineid: '7', parts: '3', action: 'Observe', datetime: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toLocaleString('en-us', { day: 'numeric', month: 'short', year: 'numeric' }) + ' - 12:05' },
    { tasks: 'Steel surface inspection camera disoriented', machineid: '5', parts: '1', action: 'Observe', datetime: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toLocaleString('en-us', { day: 'numeric', month: 'short', year: 'numeric' }) + ' - 23:45' },
    { tasks: 'DC nut runner torque mismatch', machineid: '10', parts: '24', action: 'Replace', datetime: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toLocaleString('en-us', { day: 'numeric', month: 'short', year: 'numeric' }) + ' - 22:45' },
    { tasks: 'Expected time to failure of agitator motor is 7 hours', machineid: '18', parts: '2', action: 'Observe', datetime: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toLocaleString('en-us', { day: 'numeric', month: 'short', year: 'numeric' }) + ' - 19:40' },
    { tasks: 'Pump calibration error above 90%', machineid: '11', parts: '9', action: 'Observe', datetime: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toLocaleString('en-us', { day: 'numeric', month: 'short', year: 'numeric' }) + ' - 12:30' },
];

export interface Sol {
    SolutionId: number;
    SolutionName: string;
    SolutionUrl: string;
    SolutionType: string;
    Usecases: Array<usec>;
    solutionIcon: string;
}

export interface usec {
    UsecaseId: number;
    UsecaseName: string;
    UsecaseUrl: string;
}

export interface UserData {
    UserId: number;
    UserName: string;
    FirstName: string;
    LastName: string;
    Role: string;
    Usecases: string[];
    Solutions: string[];
    SessionToken: string;
  }