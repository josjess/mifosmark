import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useLoading } from '../context/LoadingContext';
import axios from 'axios';
import { Pie, Line } from 'react-chartjs-2';
import { API_CONFIG } from '../config';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    LineElement,
    PointElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    LineElement,
    PointElement,
    ArcElement,
    Title,
    Tooltip,
    Legend
);

const Insights = ({ selectedOffice, officeOptions }) => {
    const { isAuthenticated, user } = useContext(AuthContext);
    const { startLoading, stopLoading } = useLoading();
    const [graphData, setGraphData] = useState({
        disbursalVsAwaiting: { disbursedAmount: 0, amountToBeDisburse: 0 },
        demandVsCollection: { AmountPaid: 0, AmountDue: 0 },
        trendsByDay: { clients: [], loans: [] },
        trendsByWeek: { clients: [], loans: [] },
        trendsByMonth: { clients: [], loans: [] },
    });

    const API_BASE_URL = API_CONFIG.baseURL;
    const AUTH_TOKEN = user?.base64EncodedAuthenticationKey;
    const headers = {
        'Authorization': `Basic ${AUTH_TOKEN}`,
        'Content-Type': 'application/json',
        'Fineract-Platform-TenantId': 'default',
    };

    const fetchOfficeData = async (endpoint, officeId) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/runreports/${endpoint}`, {
                headers,
                params: {
                    R_officeId: officeId,
                    genericResultSet: false,
                },
            });
            return response.data || [];
        } catch (error) {
            console.error(`Error fetching data from ${endpoint} for office ${officeId}`, error);
            return [];
        }
    };

    const fetchInsightsData = async () => {
        if (!isAuthenticated || !user) {
            console.error('User not authenticated. Cannot fetch insights data.');
            return;
        }

        startLoading();

        try {
            // Use the user's current office if "all offices" is selected
            const currentOfficeId = selectedOffice === 'all' ? user?.officeId : selectedOffice;

            const disbursalData = await fetchOfficeData('Disbursal%20Vs%20Awaitingdisbursal', currentOfficeId);
            const demandData = await fetchOfficeData('Demand%20Vs%20Collection', currentOfficeId);
            const clientTrendsDayData = await fetchOfficeData('ClientTrendsByDay', currentOfficeId);
            const clientTrendsWeekData = await fetchOfficeData('ClientTrendsByWeek', currentOfficeId);
            const clientTrendsMonthData = await fetchOfficeData('ClientTrendsByMonth', currentOfficeId);
            const loanTrendsDayData = await fetchOfficeData('LoanTrendsByDay', currentOfficeId);
            const loanTrendsWeekData = await fetchOfficeData('LoanTrendsByWeek', currentOfficeId);
            const loanTrendsMonthData = await fetchOfficeData('LoanTrendsByMonth', currentOfficeId);

            setGraphData({
                disbursalVsAwaiting: disbursalData[0] || { disbursedAmount: 0, amountToBeDisburse: 0 },
                demandVsCollection: demandData[0] || { AmountPaid: 0, AmountDue: 0 },
                trendsByDay: {
                    clients: clientTrendsDayData,
                    loans: loanTrendsDayData,
                },
                trendsByWeek: {
                    clients: clientTrendsWeekData,
                    loans: loanTrendsWeekData,
                },
                trendsByMonth: {
                    clients: clientTrendsMonthData,
                    loans: loanTrendsMonthData,
                },
            });
        } catch (error) {
            console.error('Error fetching insights data:', error.message);
        } finally {
            stopLoading();
        }
    };

    useEffect(() => {
        if (isAuthenticated && user) {
            fetchInsightsData();
        }
    }, [selectedOffice, isAuthenticated, user]);

    const officeName =
        selectedOffice === 'all'
            ? user?.officeName
            : officeOptions.find((office) => office.id === parseInt(selectedOffice))?.name || 'Unknown Office';

    const safeMap = (data, callback) => (data ? data.map(callback) : []);

    return (
        <div className="insights-container">
            {/* Office Label */}
            <div className="office-label-container">
                <h4 className="office-label">Office: {officeName}</h4>
            </div>
            {/* Disbursal vs Awaiting */}
            <div className="graph-container">
                <h3>Disbursal vs Awaiting Disbursal</h3>
                <Pie
                    data={{
                        labels: ['Disbursed', 'Awaiting Disbursal'],
                        datasets: [
                            {
                                data: [
                                    graphData.disbursalVsAwaiting.disbursedAmount || 0,
                                    graphData.disbursalVsAwaiting.amountToBeDisburse || 0,
                                ],
                                backgroundColor: ['#4caf50', '#f44336'],
                            },
                        ],
                    }}
                />
            </div>

            {/* Demand vs Collection */}
            <div className="graph-container">
                <h3>Demand vs Collection</h3>
                <Pie
                    data={{
                        labels: ['Amount Collected', 'Amount Pending'],
                        datasets: [
                            {
                                data: [
                                    graphData.demandVsCollection.AmountPaid || 0,
                                    (graphData.demandVsCollection.AmountDue || 0) - (graphData.demandVsCollection.AmountPaid || 0),
                                ],
                                backgroundColor: ['#3b83f6', '#f6c23e'],
                            },
                        ],
                    }}
                />
            </div>

            {/* Trends by Day */}
            <div className="graph-container">
                <h3>Trends by Day</h3>
                <Line
                    data={{
                        labels: safeMap(graphData.trendsByDay.clients, item => item.Days),
                        datasets: [
                            {
                                label: 'Clients Added',
                                data: safeMap(graphData.trendsByDay.clients, item => item.count),
                                borderColor: '#4bc0c0',
                                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                                fill: true,
                            },
                            {
                                label: 'Loans Disbursed',
                                data: safeMap(graphData.trendsByDay.loans, item => item.lcount),
                                borderColor: '#9966ff',
                                backgroundColor: 'rgba(153, 102, 255, 0.2)',
                                fill: true,
                            },
                        ],
                    }}
                />
            </div>

            {/* Trends by Week */}
            <div className="graph-container">
                <h3>Trends by Week</h3>
                <Line
                    data={{
                        labels: safeMap(graphData.trendsByWeek.clients, item => item.Weeks),
                        datasets: [
                            {
                                label: 'Clients Added',
                                data: safeMap(graphData.trendsByWeek.clients, item => item.count),
                                borderColor: '#4bc0c0',
                                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                                fill: true,
                            },
                            {
                                label: 'Loans Disbursed',
                                data: safeMap(graphData.trendsByWeek.loans, item => item.lcount),
                                borderColor: '#9966ff',
                                backgroundColor: 'rgba(153, 102, 255, 0.2)',
                                fill: true,
                            },
                        ],
                    }}
                />
            </div>

            {/* Trends by Month */}
            <div className="graph-container">
                <h3>Trends by Month</h3>
                <Line
                    data={{
                        labels: safeMap(graphData.trendsByMonth.clients, item => item.Months),
                        datasets: [
                            {
                                label: 'Clients Added',
                                data: safeMap(graphData.trendsByMonth.clients, item => item.count),
                                borderColor: '#4bc0c0',
                                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                                fill: true,
                            },
                            {
                                label: 'Loans Disbursed',
                                data: safeMap(graphData.trendsByMonth.loans, item => item.lcount),
                                borderColor: '#9966ff',
                                backgroundColor: 'rgba(153, 102, 255, 0.2)',
                                fill: true,
                            },
                        ],
                    }}
                />
            </div>
        </div>
    );
};

export default Insights;
