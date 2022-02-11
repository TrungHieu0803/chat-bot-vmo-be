import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsString } from "class-validator";

export class UpdateRoleDto implements Readonly<UpdateRoleDto>{

    @ApiProperty({type: Number})
    @IsNumber()
    spaceId: number;

    @ApiProperty({type: Number})
    @IsNumber()
    memberId: number;
    
    @ApiProperty({type: Number})
    @IsString()
    role: string;
}