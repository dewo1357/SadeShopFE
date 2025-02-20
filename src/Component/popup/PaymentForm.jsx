/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { useEffect } from 'react';
import Input from '../Element/Input/Input';
import Label from '../Element/Label/Label';
import { useState } from 'react';
import { getAcc } from '../../pages/manage';


const FormPayment = (props) => {
    const { setProcessMap, address, seAddress, LoadingMap, setLoadingMap } = props
    const [account,setAccount] = useState(getAcc())
    const [province, set_province] = useState([]);

    
    const [update, setUpdate] = useState(false)

    const [dataAddress, setDataAaddress] = useState({
        state: '',
        city: '',
        road: '',
        postalCode:'',
    })
    const changeProvince = (e,SessionUpdate) => {
        if(SessionUpdate==='state'){
            const state = e
            setDataAaddress({...dataAddress,state})
        }else if(SessionUpdate ==='city'){
            const city = e
            setDataAaddress({...dataAddress,city})
        }else if(SessionUpdate==='road'){
            const road = e
            setDataAaddress({...dataAddress,road})
        }else{
            const postalCode = e
            setDataAaddress({...dataAddress,postalCode})
        }
        
        setUpdate(true)
    }

    useEffect(() => {
        if (LoadingMap) {
            setLoadingMap(false)
            setDataAaddress({
                state: address.address.state,
                city: address.address.city,
                road: address.address.road,
                postalCode: address.address.postcode
            })
        }
    }, [update, LoadingMap])
   

    return (
        <>

            <div className="Contact">
                <div>
                    <Label Content="Nama Lengkap" ></Label>
                    <Input type="Input" placeholder="Masukan Username" name="nama" value={account.nama} readOnly></Input>
                </div>
                <div>
                    <Label Content="Phone Number" />
                    <Input type="Number" />
                </div>
            </div>
            <div className='Pengiriman'>
                <div>
                    <Label Content="Pengiriman" ></Label>
                    <select name="courier" id="">
                        <option value="jne">JNE</option>
                        <option value="jnt">JNT</option>
                        <option value="pos">POS</option>
                    </select>
                </div>
                <div>
                    <Label Content="Jenis" ></Label>
                    <select name="jenis" id="">
                        <option value="REG">Regular</option>
                        <option value="jnt">JNT</option>
                    </select>
                </div>
            </div>
            <div>
                <Label Content="Alamat" ></Label>
                <span className="buttonMap" onClick={() => { setProcessMap(true) }} >Check My Location</span>
                <div className="Alamat" hidden>
                    <div className='ComponentAlamat'>
                        <Label Content="Provinsi"></Label>
                        <input type="text" name='province' value={dataAddress.state} onChange={(e) => changeProvince(e.target.value,"state")} />
                    </div>
                    <div className='ComponentAlamat'>
                        <Label Content="Kota" />
                        <input type="text" name="city" value={dataAddress.city} onChange={(e) => changeProvince(e.target.value,"city")} />
                    </div>
                </div>

                <div className='Alamat'>
                    <div className='ComponentAlamat'>
                        <Label Content="Jalan"></Label>
                        <input type="text" name="road" value={dataAddress.road} onChange={(e) => changeProvince(e.target.value,"road")} />
                    </div>
                    <div className='ComponentAlamat'>
                        <Label Content="Kode Pos"></Label>
                        <input type="text" name="kodepos" value={dataAddress.postalCode} onChange={(e) => changeProvince(e.target.value,"postcode")} />
                    </div>
                </div>
                <div>
                    <Label Content="Specific" ></Label>
                    <Input type="addres" placeholder="Specific Address" name="specific" ></Input>
                </div>
            </div>


        </>
    )
}


export default FormPayment;