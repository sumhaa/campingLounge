import {useEffect, useState, useContext } from "react";
import axios from "axios";
import Pagination from "react-js-pagination";
import { HttpHeadersContext } from "../context/HttpHeadersProvider";


function AdminNewMember({loginUserId}){
    const [members, setMembers] = useState([]);
    const [editingMemberId, setEditingMemberId] = useState(null);
    const token = localStorage.getItem("CL_access_token");
    const { headers, setHeaders } = useContext(HttpHeadersContext);
    const [editFormData, setEditFormData] = useState({
        id: "",
        email: "",
        name: "",
        gender: "",
        tel: "",
        role: "",
        enable: false,
    });
    console.log(loginUserId);
    const [selectAll, setSelectAll] = useState(false);
    const [selectedMembers, setSelectedMembers] = useState([]);

    useEffect(() => {
        getMember();
        setHeaders({ "Authorization": `Bearer ${token}` });
    }, []);

    // Paging

    const getMember = async () => {
        await axios.get("http://localhost:8080/admin/members", {params:{ "size": 8}, headers})
            .then(response => {
                setMembers(response.data.content);
                setSelectedMembers([]);
                console.log("[AdminNewMember] component : [getMember] success :")
                console.log(response.data.content)
            })
            .catch(error => {
                console.log("[AdminNewMember] component : [getMember] error :")
                console.error("회원 목록를 가져오는 중 오류 발생 : ", error);
            })
    }

    const deleteMember = async (memberId) => {
        if (window.confirm("회원을 삭제하시겠습니까?")) {
            await axios.delete(`http://localhost:8080/admin/delete/${memberId}`, { headers })
                .then(response => {
                    console.log(response.data);
                    getMember();
                })
                .catch(error => {
                    console.error("회원 삭제 중 오류 발생 : ", error);
                })
        }
    }

    const handleMemberEditClick = (member) => {
        setEditingMemberId(member.id);
        setEditFormData({ ...member }); // 기존 데이터 불러오기
    };

    const handleMemberEditChange = (event) => {
        const { name, value } = event.target;
        setEditFormData({
            ...editFormData, // 기존 값 그대로 복사
            [name]: name === "enable" ? value === "true" : value, // 변경된 데이터만 업데이트
        });
    };

    const handleMemberSaveClick = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`http://localhost:8080/admin/update/${editFormData.id}`,  {
                ...editFormData,
                enable: Boolean(editFormData.enable), role: String(editFormData.role),
            }, { headers });
            console.log(editFormData);
            alert("회원 정보가 수정되었습니다.");
            setEditingMemberId(null);  // 수정 모드 종료
            getMember(); // 리스트 새로고침
        } catch (error) {
            console.error("회원 수정 중 오류 발생: ", error);
            console.log(editFormData);
        }
    };

    const handleSelectMember = (memberId) => {
        setSelectedMembers(prevSelected =>
            prevSelected.includes(memberId)
                ? prevSelected.filter(id => id !== memberId)
                : [...prevSelected, memberId]
        );
    };

    const handleSelectAll = () => {
        if (selectAll) {
            setSelectedMembers([]);
        } else {
            setSelectedMembers(members.map(member => member.id));
        }
        setSelectAll(!selectAll);
    };

    const handleBulkDelete = async () => {
        if (selectedMembers.length === 0) {
            alert("삭제할 회원을 선택해주세요.");
            return;
        }
        if (window.confirm("선택한 회원을 삭제하시겠습니까?")) {
            await Promise.all(selectedMembers.map(memberId => axios.delete(`http://localhost:8080/admin/delete/${memberId}`, { headers })))
                .then(() => {
                    alert("선택한 회원이 삭제되었습니다.");
                    getMember();
                })
                .catch(error => {
                    console.error("일괄 삭제 중 오류 발생 : ", error);
                });
        }
    };

    return(
        <>
            <h3 className="fs_xlg">신규 회원</h3>
            <div className="table_wrap">
                <form className="dashboard-form">
                    <table>
                        <thead>
                        <tr>
                            <td><input type="checkbox" className="check-all" checked={selectAll} onChange={handleSelectAll} /></td>
                            <td>순번</td>
                            <td>이메일</td>
                            <td>이름</td>
                            <td>성별</td>
                            <td>전화번호</td>
                            <td>권한</td>
                            <td>상태</td>
                            <td>수정</td>
                            <td>삭제</td>
                        </tr>
                        </thead>
                        <tbody>
                        {members.map(member => (
                            <tr key={member.id}>
                                {editingMemberId === member.id ? (
                                    <>
                                        <td><input type="checkbox" className="checkbox"
                                                   checked={selectedMembers.includes(member.id)}
                                                   onChange={() => handleSelectMember(member.id)}/></td>
                                        <td>{member.id}</td>
                                        <td>{member.email}</td>
                                        <td><input type="text" name="name" value={editFormData.name}
                                                   onChange={handleMemberEditChange}/></td>
                                        <td>
                                            <select name="gender" value={editFormData.gender}
                                                    onChange={handleMemberEditChange}>
                                                <option value="남자">남자</option>
                                                <option value="여자">여자</option>
                                            </select>
                                        </td>
                                        <td><input type="text" name="tel" value={editFormData.tel}
                                                   onChange={handleMemberEditChange}/>
                                        </td>
                                        <td>
                                            <select name="role" value={editFormData.role}
                                                    onChange={handleMemberEditChange}>
                                                <option value="USER">USER</option>
                                                <option value="ADMIN">ADMIN</option>
                                            </select>
                                        </td>
                                        <td>
                                            <select name="enable" value={editFormData.enable}
                                                    onChange={handleMemberEditChange}>
                                                <option value="true">활성</option>
                                                <option value="false">비활성</option>
                                            </select>
                                        </td>
                                        <td>
                                            <button
                                                className="btn btn-p-f btn-xsm"
                                                onClick={handleMemberSaveClick}
                                            >
                                                저장
                                            </button>
                                        </td>
                                        <td>
                                            <button
                                                className="btn btn-e-l btn-xsm"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    setEditingMemberId(null);
                                                }
                                                }
                                            >
                                                취소
                                            </button>
                                        </td>
                                    </>
                                ) : (
                                    <>
                                        {String(member.id) !== loginUserId ? (
                                            <>
                                                <td><input type="checkbox" className="checkbox"
                                                           checked={selectedMembers.includes(member.id)}
                                                           onChange={() => handleSelectMember(member.id)}/></td>
                                                <td>{member.id}</td>
                                                <td>{member.email}</td>
                                                <td>{member.name}</td>
                                                <td>{member.gender}</td>
                                                <td>{member.tel}</td>
                                                <td>{member.role}</td>
                                                <td>{member.enable ? "활성" : "비활성"}</td>
                                                <td>
                                                    <button
                                                        className="btn btn-p-f btn-xsm"
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            handleMemberEditClick(member);
                                                        }
                                                        }
                                                    >
                                                        수정
                                                    </button>
                                                </td>
                                                <td>
                                                    <button
                                                        className="btn btn-e-l btn-xsm"
                                                        onClick={() => {
                                                            deleteMember(member.id)
                                                        }}
                                                    >
                                                        삭제
                                                    </button>
                                                </td>
                                            </>
                                        ) : null}
                                    </>
                                )}
                            </tr>
                        ))}
                        <tr>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td>
                                <button type="btn btn-e-l btn-xsm" className="btn btn-e-l btn-xsm"
                                        onClick={handleBulkDelete}>
                                    선택 삭제
                                </button>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                    <div className="bar"></div>

                </form>
            </div>
        </>
    );
}

export default AdminNewMember;