import React, { useEffect, useState } from 'react';
import Mail from './Mail';

export default function Orders() {

    const [ordersData, setOrdersData] = useState({});
    const [currentStatus, setCurrentStatus] = useState("Pending");

    const fetchOrders = async (status) => {
        
        try {
            let token = localStorage.getItem("usersdatatoken");
            if(!token) {
                console.log("Token not found");
                return;
            }

            const response = await fetch(`/api/getorder?show_flag=${status}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + token,
                },
            });

            if (response.status === 200) {
                const result = await response.json();
                setOrdersData(result);
            } else {
                console.error('Failed to fetch data');
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    useEffect(() => {
        fetchOrders(currentStatus);
    }, [currentStatus]);

    const handleStatusChange = (status) => {
        setCurrentStatus(status);
    };

    return (
        <div className="flex">
            <div className=" h-[100%] w-full overflow-y-auto flex flex-row  py-2">
                <Mail
                    fetchOrders={fetchOrders}
                    ordersData={ordersData}
                    onStatusChange={handleStatusChange}
                    currentStatus={currentStatus}
                />
            </div>
        </div>
    );
}
