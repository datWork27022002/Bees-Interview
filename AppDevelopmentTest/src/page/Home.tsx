import { useEffect, useState } from "react";
import { Table } from "antd";
import { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import axios from "axios";
import { toast } from "react-toastify";

import DarkModeToggle from "./DarkModeToggle";

interface TUser {
    id: string;
    name: string;
    balance: number;
    email: string;
    registerAt: Date;
    active: boolean;
}

const Home = () => {
    const [data, setData] = useState<TUser[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    const columns: ColumnsType<TUser> = [
        {
            title: "Name",
            dataIndex: "name",
            key: "name",
            className: "font-semibold ",
            sorter: (a, b) => a.name.localeCompare(b.name), // Sắp xếp theo tên
            width: 200, // Cố định chiều rộng của cột Name
        },
        {
            title: "Balance",
            dataIndex: "balance",
            key: "balance",
            render: (value: number) => {
                return (
                    <span className="text-center text-green-600">
                        ${value.toLocaleString()}
                    </span>
                );
            },

            sorter: (a, b) => a.balance - b.balance, // Sắp xếp theo balance
            width: 180,
        },
        {
            title: "Email",
            dataIndex: "email",
            key: "email",
            render: (value: string) => (
                <a
                    href={`mailto:${value}`}
                    className="text-blue-500 hover:text-blue-700 underline"
                >
                    {value}
                </a>
            ),
            sorter: (a, b) => a.email.localeCompare(b.email), // Sắp xếp theo email
            width: 250,
        },
        {
            title: "Registration",
            dataIndex: "registerAt",
            key: "registerAt",
            render: (value: Date) => (
                <>
                    <span title={dayjs(value).format("YYYY-MM-DD HH:mm:ss")}>
                        {dayjs(value).format("YYYY-MM-DD")}
                    </span>
                </>
            ),
            sorter: (a, b) => a.registerAt.getTime() - b.registerAt.getTime(), // Sắp xếp theo ngày đăng ký
            width: 220,
        },
        {
            title: "Status",
            dataIndex: "active",
            key: "active",
            render: (value: boolean) => (
                <span
                    className={`${
                        value ? "text-green-500" : "text-red-500"
                    } font-semibold`}
                >
                    {value ? "Active" : "Inactive"}
                </span>
            ),
            className: "text-center",
            sorter: (a, b) => Number(a.active) - Number(b.active), // Sắp xếp theo trạng thái active (true/false)
            filters: [
                { text: "Active", value: true },
                { text: "Inactive", value: false },
            ],
            onFilter: (value, record) => record.active === value,
            width: 120,
        },
    ];

    useEffect(() => {
        axios
            .get<TUser[]>(
                "https://67f0a9ab2a80b06b889850a1.mockapi.io/api/users"
            )
            .then((response) => {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const users: TUser[] = response.data.map((user: any) => ({
                    ...user,
                    registerAt: new Date(user.registerAt),
                }));
                setData(users); // Cập nhật dữ liệu vào state
                setLoading(false); // Đặt loading thành false ngay cả khi có lỗi
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
                toast.error("Error fetching data:" + error, {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: false,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                });
                setLoading(false); // Đặt loading thành false khi dữ liệu đã được tải xong
            });
    }, []);

    return (
        <div className="container mx-auto p-5">
            <DarkModeToggle />
            <div className="overflow-x-auto">
                <Table<TUser>
                    columns={columns}
                    dataSource={data}
                    rowKey="id"
                    className="border border-gray-300 rounded-lg shadow-lg"
                    bordered // Thêm viền cho bảng
                    // Cải thiện responsive cho bảng
                    scroll={{ x: "max-content" }} // Thêm thanh cuộn ngang khi bảng rộng
                    loading={loading}
                    tableLayout="fixed"
                />
            </div>
        </div>
    );
};

export default Home;
